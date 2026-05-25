"use server";

import { User } from "@/generated/prisma/client";
import action from "../handlers/actions";
import handleError from "../handlers/error";
import { SignInSchema, SignUpSchema } from "../validation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";
import { NotFoundError } from "../http-errors";

export async function signUpWithCredentials(params: AuthCredentials): Promise<ActionResponse<User>> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await prisma.$transaction(async (tx) => {
      // exact match first
      const existingUser = await tx.user.findUnique({
        where: { email: normalizedEmail },
      });

      // if not found, look for rows where lower(trim(email)) equals normalizedEmail
      if (!existingUser) {
        const matches = (await tx.$queryRaw`
          SELECT id FROM "User" WHERE lower(trim(email)) = ${normalizedEmail} LIMIT 1
        `) as Array<{ id: string }>;

        if (Array.isArray(matches) && matches.length > 0) {
          // normalize stored email to canonical form and treat as existing
          const raw = matches[0];
          await tx.user.update({ where: { id: raw.id }, data: { email: normalizedEmail } });
          throw new Error("User already exists");
        }
      }

      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await tx.user.create({
        data: {
          name,
          username: username.trim(),
          email: normalizedEmail,
          password: hashedPassword,
        },
      });

      return newUser;
    });

    await signIn("credentials", { email: normalizedEmail, password, redirect: false });

    return { success: true, data: user };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { email, password } = validationResult.params!;

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail
      },
    });

    if (!existingUser) throw new NotFoundError("User");

    // OAuth-only account
    if (!existingUser.password) {
      throw new Error("Password has not been created yet. Please use Forgot Password to create one.");
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password!);

    if (!passwordMatch) throw new Error("Password does not match");

    await signIn("credentials", { email, password, redirect: false});

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
