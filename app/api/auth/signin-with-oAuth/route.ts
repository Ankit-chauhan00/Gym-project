import { ValidationError } from "@/lib/http-errors";
import prisma from "@/lib/prisma";
import { SigninWithOAuthSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import z from "zod";
import slugify from "slugify";
import handleError from "@/lib/handlers/error";
import { ErrorResponse } from "@/types/global";

export async function POST(request: Request) {
  try {
    const { provider, user, providerAccountId } = await request.json();

    const validatedData = SigninWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });
    if (!validatedData.success) {
      const flattenError = z.treeifyError(validatedData.error);
      throw new ValidationError(flattenError);
    }

    const { name, username, email, image } = user;
    const normalizedEmail = email.trim().toLowerCase();

    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    await prisma.$transaction(async (tx) => {
      // STEP 1 → Check existing account
      const existingAccount = await tx.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider,
            providerAccountId,
          },
        },
      });

      if (existingAccount) return;

      let existingUser = await tx.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      });

      if (!existingUser) {
        existingUser = await tx.user.create({
          data: {
            name,
            email: normalizedEmail,
            image,
            username: `${slugifiedUsername}_${Math.floor(Math.random() * 10000)}`,
          },
        });
      }

      //Step-4 create linked Account
      await tx.account.create({
        data: {
          provider,
          providerAccountId,
          userId: existingUser.id,
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
