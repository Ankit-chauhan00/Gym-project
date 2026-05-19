"use server";

import { User } from "@/generated/prisma/client";
import action from "../handlers/actions";
import handleError from "../handlers/error";
import { SignUpSchema } from "../validation";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

export async function signUpWithCredentials(params: AuthCredentials): Promise<ActionResponse<User>> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  try {
    const user = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: {
          email,
        },
      });

      if (existingUser) throw new Error("User Alredy Exists");

      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await tx.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
        },
      });

      return newUser;
    });

    await signIn("credentials", { email, password, redirect: false });

    return { success: true, data: user };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
