"use client";
import { ActionResponse } from "@/types/action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, DefaultValues,  FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { FieldGroup, Field, FieldLabel, FieldError } from "../ui/field";
import { Input } from "../ui/input";
import { fieldConfig } from "@/constants/config";

import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "../ui/select";

interface MembershipProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<{ success: boolean }>;
}

const MembershipForms = <T extends FieldValues>({ schema, defaultValues, onSubmit }: MembershipProps<T>) => {
  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const formData = {
      ...data,
    };
    const result = (await onSubmit(formData as T)) as ActionResponse;

    if (result?.success) {
      toast.success("Membership Created Successfully");
      form.reset();
    } else {
      toast.error("unable to Create Membership");
    }
  };
  return (
    <Card className="ml-10 w-full max-w-4xl rounded-3xl border border-slate-700/70 bg-slate-950 shadow-2xl shadow-slate-950/20">
      <CardHeader className="space-y-3 px-6 pt-6 pb-2 text-slate-100">
        <CardTitle className="text-3xl font-semibold tracking-tight text-white">Add Membership</CardTitle>
      </CardHeader>
      <CardContent className="px-6 py-4">
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 sm:grid-cols-2">
          {Object.keys(defaultValues).map((fieldname) => (
            <FieldGroup key={fieldname} className="sm:col-span-1">
              <Controller
                name={fieldname as Path<T>}
                control={form.control}
                render={({ field, fieldState }) => {
                  const config = fieldConfig[field.name as keyof typeof fieldConfig];

                  return (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={fieldname}>
                        {config?.label ?? field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                      </FieldLabel>

                      {config?.type === "select" ? (
                        <Select value={String(field.value)} onValueChange={(value) => field.onChange(value === "true")}>
                          <SelectTrigger className="h-12 rounded-xl border border-slate-700 bg-slate-900 text-slate-100">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>

                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          {...field}
                          id={fieldname}
                          type={config?.type ?? "text"}
                          value={field.value ?? ""}
                          placeholder={config?.placeholder ?? `Enter ${field.name}`}
                          onChange={(e) => {
                            if (config?.type === "number") {
                              field.onChange(e.target.value === "" ? "" : Number(e.target.value));
                            } else {
                              field.onChange(e.target.value);
                            }
                          }}
                          autoComplete="off"
                          aria-invalid={fieldState.invalid}
                          className="h-12 rounded-xl border border-slate-700 bg-slate-900 px-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/10"
                        />
                      )}

                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  );
                }}
              />
            </FieldGroup>
          ))}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 px-6 pt-2 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <Field orientation="horizontal" className="font-asap flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Button
            className="w-full rounded-2xl bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600 sm:w-auto"
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
            Create Membership
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default MembershipForms;
