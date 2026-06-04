"use server";

import z, { ZodError, ZodSchema } from "zod";

import { Session } from "next-auth";

import { auth } from "@/auth";

import { UnauthorizedError, ValidationError } from "../http-errors";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
  authorize?: boolean;
  isAdmin?: boolean;
};

async function action<T>({ params, schema, authorize = false, isAdmin }: ActionOptions<T>) {
  if (schema && params) {
    try {
      params = schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        const treeError = z.treeifyError(error);

        return new ValidationError(treeError);
      }

      return new Error("Schema validation failed");
    }
  }

  let session: Session | null = null;

  if (authorize) {
    session = await auth();

    if (!session) {
      return new UnauthorizedError();
    }

    if( isAdmin){

      if(session.user.role !== 'ADMIN')
        return new UnauthorizedError("Only Admin can Access");
    }

  }

  return {
    params,
    session,
  };
}

export default action;
