"use server";

import { ActionResponse, CreateProductParams } from "@/types/action";
import action from "../handlers/actions";
import { productCreationSchema } from "../validation";
import { auth } from "@/auth";
import handleError from "../handlers/error";
import { ErrorResponse, SerializedProduct } from "@/types/global";
import prisma from "../prisma";
import { searilizeProduct } from "@/constants/helper";

interface ProductionCreationServerAction extends CreateProductParams {
  images?: string[];
  model3d?: File;
}



export async function CreateProduct(params: ProductionCreationServerAction): Promise<ActionResponse<SerializedProduct>> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validationResult = await action({
    params,
    schema: productCreationSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { images, modelUrl, title, description, stock, price } = validationResult.params!;

  console.log("MODEL URL : ", modelUrl);
  try {
    const result = await prisma.$transaction(async (tx) => {
      // create Product

      const product = await tx.product.create({
        data: {
          title,
          description,
          price,
          stock,
          modelUrl,
          
          CreatedByAdmin:{
            connect: {
              id: session.user.id
            }
          }
        },
      });

      // create images
      if (images?.length) {
        await tx.productImages.createMany({
          data: images.map((url) => ({
            imageUrl: url,
            productId: product.id,
          })),
        });
      }

      return product;
    });

    return { success: true, data: searilizeProduct(result), };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
