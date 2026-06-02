"use server";

import { ActionResponse, CreateProductParams } from "@/types/action";
import action from "../handlers/actions";
import { productCreationSchema } from "../validation";
import { auth } from "@/auth";
import handleError from "../handlers/error";
import { ErrorResponse } from "@/types/global";

interface ProductionCreationServerAction extends CreateProductParams {
  images?: string[];
  model3d?: File;
}

export async function CreateProduct(params: ProductionCreationServerAction): Promise<ActionResponse> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validationResult = action({
    params,
    schema: productCreationSchema,
    authorize: true,
  });

  if(validationResult instanceof Error)
    return handleError(validationResult) as ErrorResponse;



  // i have to store model in clouflare 
  // imaeg array to be stored in procuct_image table
  // ad add the product with the fiels comming to product table

}
