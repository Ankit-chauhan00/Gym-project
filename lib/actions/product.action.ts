"use server";

import {
  ActionResponse,
  AddToCartParams,
  CreateProductParams,
  GetFilteredProducts,
  ProductWithImages,
} from "@/types/action";
import action from "../handlers/actions";
import {
  AddToCartSchema,
  GetFilteredProductsSchema,
  GetProductByIdSchema,
  productCreationActionSchema,
} from "../validation";
import { auth } from "@/auth";
import handleError from "../handlers/error";
import { ErrorResponse, SerializedProduct } from "@/types/global";
import prisma from "../prisma";
import { searilizeProduct } from "@/constants/helper";
import { Category, Prisma, ProductType } from "@prisma/client";
import { redis } from "../redis";
import { success } from "zod";

interface ProductionCreationServerAction extends CreateProductParams {
  images?: string[];
  modelUrl?: string;
}
interface GetProductById {
  productId: string;
}

type ProductWithSingleImage = Prisma.ProductGetPayload<{
  select: {
    id: true;
    title: true;
    price: true;
    stock: true;
    category: true;
    modelUrl: true;
    productType: true;

    images: {
      take: 1;

      select: {
        imageUrl: true;
      };
    };
  };
}>;

export async function CreateProduct(
  params: ProductionCreationServerAction
): Promise<ActionResponse<SerializedProduct>> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const validationResult = await action({
    params,
    schema: productCreationActionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { images, modelUrl, title, description, stock, price, category, productType } = validationResult.params!;

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
          category,
          productType,

          CreatedByAdmin: {
            connect: {
              id: session.user.id,
            },
          },
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

    return { success: true, data: searilizeProduct(result) };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function GetProduct(params: GetProductById): Promise<ActionResponse<ProductWithImages>> {
  const validationResult = await action({
    params,
    schema: GetProductByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { productId } = validationResult.params!;

  try {
    const cacheKey = `product:${productId}`;

    // CHECK REDIS CACHE
    const cachedProduct = await redis.get(cacheKey);

    if (cachedProduct) {
      console.log("CACHE HIT");

      return {
        success: true,
        data: JSON.parse(cachedProduct),
      };
    }

    console.log("CACHE MISS");

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        images: {
          select: {
            imageUrl: true,
          },
        },
      },
    });

    if (!product) throw new Error("Product Not Found");

    const flatternProduct = {
      ...product,
      images: product?.images.map((img) => img.imageUrl),
    };

    // STORE IN REDIS
    await redis.set(cacheKey, JSON.stringify(flatternProduct), "EX", 60 * 60);

    return { success: true, data: flatternProduct };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getFilteredProducts(
  params: GetFilteredProducts
): Promise<ActionResponse<{ products: ProductWithSingleImage[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: GetFilteredProductsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { page = 1, pageSize = 12, filter, query, category, productType } = validationResult.params!;

  const cacheKey = [
    "products",
    page,
    pageSize,
    query || "all",
    category || "all",
    productType || "all",
    filter || "newest",
  ].join(":");

  const cachedProducts = await redis.get(cacheKey);

  if (cachedProducts) {
    console.log("CACHE PRODUCT HIT");
    return JSON.parse(cachedProducts);
  }

  console.log("CACHE MISS");

  try {
    // Where filters

    const where: Prisma.ProductWhereInput = {
      ...(query && {
        title: {
          contains: query,
          mode: "insensitive",
        },
      }),

      ...(category && {
        category: category as Category,
      }),

      ...(productType && {
        productType: productType as ProductType,
      }),
    };

    //Sorting

    let orderBy: Prisma.ProductOrderByWithRelationInput = {};

    switch (filter) {
      case "cheapest":
        orderBy = {
          price: "asc",
        };
        break;

      case "expensive":
        orderBy = {
          price: "desc",
        };
        break;

      case "oldest":
        orderBy = {
          createdAt: "asc",
        };
        break;

      default:
        orderBy = {
          createdAt: "desc",
        };
    }

    // PAGINATION
    const skip = (page - 1) * pageSize;

    const products = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        stock: true,
        category: true,
        modelUrl: true,
        productType: true,

        images: {
          take: 1,
          select: {
            imageUrl: true,
          },
        },
      },

      where,

      orderBy,

      skip,

      take: pageSize + 1,
    });

    // NEXT PAGE CHECK
    const isNext = products.length > pageSize;

    if (isNext) {
      products.pop();
    }

    const response = {
      success: true,
      data: {
        products,
        isNext,
      },
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 180);

    return response;
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function AddProductToCart(params: AddToCartParams): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: AddToCartSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const userId = validationResult.session?.user.id;

  if (!userId) throw new Error("Need To be LoggedIn or Signed up");

  const { productId } = validationResult.params!;

  try {
    const result = await prisma.$transaction(async (tx) => {
      let cart = await tx.cart.findFirst({
        where: {
          userId,
          cartType: "BOOKMARK",
        },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: {
            userId,
            cartType: "BOOKMARK",
          },
        });
      }

      const existingItem = await tx.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

      if (existingItem) {
        return {
          success: true,
          message: "Alredy in Cart",
        };
      }

      if (!existingItem) {
        await tx.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
          },
        });
      }

      return {success: true, message: "Added to Cart"}
    });

    return result;
    
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
