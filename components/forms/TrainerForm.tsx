"use client";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { ActionResponse } from "@/types/action";
import ImageUpload from "../shared/ImageUpload";
import Image from "next/image";

interface TrainerFormProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
}

const TrainerForm = <T extends FieldValues>({ schema, defaultValues, onSubmit }: TrainerFormProps<T>) => {
  const [imageUrl, setImageUrl] = React.useState("");

  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) ,
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const formData = {
      ...data,
      image: imageUrl,
    };
    const result = (await onSubmit(formData as T)) as ActionResponse;

    if (result?.success) {
      toast.success("Trainer Created Successfully");

      form.reset();
      setImageUrl("");
    } else {
      toast.error(`Error ${result?.status ?? 500}`, {
        description: result?.error?.message ?? "Unknown error occurred",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl rounded-3xl border border-slate-700/70 bg-slate-950 shadow-2xl shadow-slate-950/20">
      <CardHeader className="space-y-3 px-6 pt-6 pb-2 text-slate-100">
        <CardTitle className="text-3xl font-semibold tracking-tight text-white">Add Trainer</CardTitle>
        <CardDescription className="max-w-2xl text-sm leading-6 text-slate-300">
          Create a polished trainer profile with credentials, contact info, and a profile image. Use the form below to
          keep your trainer roster professional, approachable, and ready for members.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 sm:grid-cols-2">
          {Object.keys(defaultValues).map((fieldname) => (
            <FieldGroup key={fieldname} className="sm:col-span-1">
              <Controller
                name={fieldname as Path<T>}
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={fieldname}>
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
                      id={fieldname}
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
                                : field.name === "experience"
                                  ? "Enter experience in years"
                                  : `Enter your ${field.name}`
                      }
                      autoComplete="off"
                      className="h-12 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                    />

                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          ))}
          <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300 ring-1 ring-slate-700/80 sm:col-span-2">
            <p className="text-base font-semibold text-white">Trainer profile tips</p>
            <ul className="mt-3 space-y-2 text-slate-300">
              <li>• Use a friendly full name and accurate specialty.</li>
              <li>• Upload a clear profile image to build trust with members.</li>
              <li>• Verify contact details so clients can reach out quickly.</li>
            </ul>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 px-6 pt-2 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-4">
          <div className="rounded-3xl border border-slate-700/70 bg-slate-900/80 p-4 shadow-inner shadow-slate-950/10 sm:min-w-[260px]">
            <ImageUpload onUpload={setImageUrl} />
            {imageUrl ? (
              <div className="mt-4 overflow-hidden rounded-3xl border border-slate-700">
                <Image
                  height={200}
                  width={200}
                  src={imageUrl}
                  alt="uploaded-image"
                  className="h-32 w-32 object-cover"
                />
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-400">Upload a trainer photo to complete the profile preview.</p>
            )}
          </div>
        </div>

        <Field orientation="horizontal" className="font-asap flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button
            className="w-full rounded-2xl  bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 sm:w-auto"
            type="button"
            onClick={() => form.reset()}
          >
            Reset
          </Button>
          <Button
            className="w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 sm:w-auto"
            type="submit"
            form="form-rhf-demo"
          >
            Create Trainer
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default TrainerForm;
