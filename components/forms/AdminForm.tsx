/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import ImageUpload from "../shared/ImageUpload";
import Image from "next/image";
import { ActionResponse } from "@/types/action";

interface AdminFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
}

const AdminForm = <T extends FieldValues>({ schema, onSubmit, defaultValues }: AdminFormProps<T>) => {
  const [imageUrl, setImageUrl] = React.useState("");

  const form = useForm<T>({
    resolver: zodResolver(schema) as any,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit({
      ...data,
      image: imageUrl,
    })) as ActionResponse;

    if (result?.success) {
      window.location.href = "/";
    } else {
      toast.error(result?.error?.message || `Error ${result?.status}`);
    }
  };

  return (
    <Card className="font-iceland flex w-1/2 flex-col gap-6 border border-gray-200 bg-white sm:gap-10 dark:border-gray-800 dark:bg-black">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="font-iceland text-3xl font-bold text-black sm:text-5xl dark:text-white">
          WELCOME
          <span className="text-lg text-red-500 sm:text-2xl"> BACK</span>
        </CardTitle>
        <CardDescription className="text-sm text-gray-600 sm:text-base dark:text-gray-400"></CardDescription>
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
          <ImageUpload onUpload={setImageUrl} />
          {imageUrl && (
            <div className="relative h-32 w-32 overflow-hidden rounded-xl border border-gray-700">
              <Image height={200} width={200} src={imageUrl} alt="uploaded-image" className=" rounded-xl object-cover" />
            </div>
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
            Create Admin
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default AdminForm;
