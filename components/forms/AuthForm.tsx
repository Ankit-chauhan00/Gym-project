"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ROUTES from "@/constants/routes";

interface AuthFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({ schema, formType, onSubmit, defaultValues }: AuthFormProps<T>) => {
  
  const router = useRouter();

  const form = useForm<T>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit(data)) as ActionResponse;

    if(result?.success){
      toast("Success",{
        description: formType === "SIGN_IN" ? "Signed in Successfully": "Signed up Successfully"
      })
      router.refresh();
      router.push(ROUTES.HOME);
    }else{
      toast.error(result?.error?.message || `Error ${result?.status}` )
    }
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <Card className="font-iceland flex w-full flex-col gap-6 border border-gray-200 bg-white sm:gap-10 dark:border-gray-800 dark:bg-black">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="font-iceland text-3xl font-bold text-black sm:text-5xl dark:text-white">
          WELCOME
          <span className="text-lg text-red-500 sm:text-2xl"> BACK</span>
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 sm:text-base dark:text-gray-400">
          {formType === "SIGN_IN" ? "Welcome back! Sign in to your account" : "Sign up and start your journey with us"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
          {Object.keys(defaultValues).map((fieldName) => (
            <FieldGroup key={fieldName}>
              <Controller
                name={fieldName as Path<T>}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      className="text-base font-medium text-black sm:text-lg dark:text-white"
                      htmlFor={fieldName}
                    >
                      {field.name === "email"
                        ? "Email Address"
                        : field.name === "username"
                          ? "Username"
                          : field.name === "name"
                            ? "Full Name"
                            : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    </FieldLabel>

                    <Input
                      {...field}
                      id={fieldName}
                      type={field.name === "password" ? "password" : field.name === "email" ? "email" : "text"}
                      aria-invalid={fieldState.invalid}
                      placeholder={
                        field.name === "email"
                          ? "Enter your email address"
                          : field.name === "password"
                            ? "Enter your password"
                            : field.name === "username"
                              ? "Enter your username"
                              : field.name === "name"
                                ? "Enter your full name"
                                : `Enter your ${field.name}`
                      }
                      autoComplete="off"
                      className="border border-gray-300 bg-gray-50 text-black dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          ))}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 pt-4 sm:gap-5 sm:pt-6">
        <Field>
          {formType === "SIGN_IN" ? (
            <p className="font-frans text-xs font-light text-gray-600 sm:text-sm dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-asap rounded bg-red-500 px-2 py-1 font-bold text-white transition-colors hover:bg-red-600"
              >
                Sign Up
              </Link>
            </p>
          ) : (
            <p className="font-frans text-xs font-light text-gray-600 sm:text-sm dark:text-gray-400">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-asap rounded bg-red-500 px-2 py-1 font-bold text-white transition-colors hover:bg-red-600"
              >
                Sign In
              </Link>
            </p>
          )}
        </Field>
        <Field orientation="horizontal" className="font-asap gap-3 sm:gap-4">
          <Button
            className="flex-1 bg-gray-200 px-4 py-2 font-bold text-black transition-colors hover:bg-gray-300 sm:flex-none sm:px-6 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            type="button"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button
            className="flex-1 bg-red-500 px-4 py-2 font-bold text-white transition-colors hover:bg-red-600 sm:flex-none sm:px-6"
            type="submit"
            form="form-rhf-demo"
          >
            {buttonText}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
