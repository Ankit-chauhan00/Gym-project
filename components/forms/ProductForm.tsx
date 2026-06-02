"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, DefaultValues, FieldValues, Path, SubmitHandler, useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import z, { maxSize } from "zod";
import { Input } from "../ui/input";
import ImageUpload from "../shared/ImageUpload";
import { Button } from "../ui/button";
import Image from "next/image";
import { ActionResponse } from "@/types/action";
import { toast } from "sonner";

interface ProductFromProps<T extends FieldValues> {
  schema: z.ZodType<T>;
  defaultValues: T;
  onSubmit: Promise<{ success: boolean }>;
}

const ProductForm = <T extends FieldValues>({ schema, defaultValues, onSubmit }: ProductFromProps<T>) => {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [modelUrl, setModelUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleImageUploads = (url: string) => {
    setImageUrls((prev) => [...prev, url]);
  };

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const formData = {
      ...data,
      images: imageUrls,
      modelUrl,
    };

    const result = (await onSubmit(formData as T)) as ActionResponse;

    if (result?.success) {
      toast.success("Product Added Success Fully");

      form.reset();

      setImageUrls([]);
      setModelUrl("");

      // clear model input
      const modelInput = document.querySelector('input[name="model3d"]') as HTMLInputElement;

      if (modelInput) modelInput.value = "";
    } else {
      toast.error("Unable To Add product");
    }
  };

  return (
    <Card className="font-iceland ml-30 flex w-1/2 flex-col gap-6 border border-gray-200 bg-white sm:gap-10 dark:border-gray-800 dark:bg-black">
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
                      {field.name === "title"
                        ? "Product Title"
                        : field.name === "description"
                          ? "Product Description"
                          : field.name === "price"
                            ? "Enter the Product Price"
                            : field.name === "stock"
                              ? "Number of Available Stocks"
                              : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    </FieldLabel>
                    <Input
                      {...field}
                      id={fieldName}
                      type={["price", "stock"].includes(field.name) ? "number" : "text"}
                      min={["price", "stock"].includes(field.name) ? 0 : undefined}
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
                                  : field.name === "stock"
                                    ? "Number of available stocks"
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
          <FieldLabel className="text-base font-medium text-black sm:text-lg dark:text-white">
            Upload Images ( you can add multiple images just add and click upload and repeat)
          </FieldLabel>
          <ImageUpload onUpload={handleImageUploads} multiple />
          {imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative h-32 w-32 overflow-hidden rounded-xl border border-gray-700">
                  <Image src={url} alt={`product-image-${idx}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </Field>

        <Field>
          <FieldLabel className="text-base font-medium text-black sm:text-lg dark:text-white">
            Upload 3D model (only .glb files)
          </FieldLabel>
          <Input
            onChange={async (e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              const MAX_SIXE = 20 * 1024 * 1024;

              if (file.size > MAX_SIXE) {
                toast.error("Large model size");
                e.target.value = "";
                return;
              }

              try {
                setUploading(true);

                const formData = new FormData();

                formData.append("file", file);

                const res = await fetch("/api/upload-model", {
                  method: "POST",
                  body: formData,
                });

                if (!res.ok) {
                  toast.error("Request failed to upload")
                  e.target.value = ""
                }

                const data = await res.json();

                setModelUrl(data.url);
              } catch (error) {
                console.log(error);

                setModelUrl("");

                toast.error("Uplaod failed");
              } finally {
                setUploading(false);
              }
            }}
            type="file"
            name="model3d"
            accept=".glb"
            className="cursor-pointer"
          />

          {uploading && <p>Uploading model...</p>}

          {modelUrl && <p>Model uploaded successfully</p>}
        </Field>

        <Field orientation="responsive" className="font-asap gap-3 sm:gap-4">
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
            Add Product
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default ProductForm;
