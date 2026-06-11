"use server";

import { ActionResponse, CreateOrderParams } from "@/types/action";
import action from "../handlers/actions";
import { createOrderSchema } from "../validation";
import handleError from "../handlers/error";
import { ErrorResponse } from "@/types/global";
import { getUser } from "./user.action";
import { GetProduct } from "./product.action";
import prisma from "../prisma";
import { Order } from "@prisma/client";

export async function createOrder(params: CreateOrderParams): Promise<ActionResponse<Order>> {
  const validationResult = await action({
    params,
    schema: createOrderSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const userId = validationResult.session?.user.id;
  if (!userId) throw new Error("Need to be loggedin or sign up");

  const {
    productId,
    quantity,
    totalAmount,
    fullname,
    phoneNumber,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    paymentMode,
  } = validationResult.params!;

  const isValidUser = await getUser();
  if (!isValidUser.success || !isValidUser.data) throw new Error("User not Found");

  const isValidProduct = await GetProduct({ productId });

  if (!isValidProduct.success || !isValidProduct.data) throw new Error("Product Not found");

  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: {
          take: 1,
        },
      },
    });

    if (!product) throw new Error("Product Not found");

    const { title, price } = product!;

    const order = await prisma.order.create({
      data: {
        userId,
        productId,

        productName: title,
        productPrice: price,
        orderStatus: "PENDING",

        quantity,
        totalAmount,
        paymentMode: paymentMode,

        fullName: fullname,
        phoneNumber,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country,
      },
    });

    return { success: true, data: JSON.parse(JSON.stringify(order)) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
