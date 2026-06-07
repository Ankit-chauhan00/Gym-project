"use server";

import { ActionResponse, GetCartItemsParams, GetTrainerParams, ProductWithImages } from "@/types/action";
import { ErrorResponse, PaginatedSearchParams, TrainerWithUser } from "@/types/global";
import { Product, Trainer, User } from "@prisma/client";
import action from "../handlers/actions";
import { GetCartItemsSchema, GetTrainerByIdSchema, PaginatedSearchParamsSchema } from "../validation";
import handleError from "../handlers/error";
import prisma from "../prisma";
import { redis } from "@/lib/redis";
import { auth } from "@/auth";

export async function getSavedTrainers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ trainers: Trainer[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { page = 1, pageSize = 1, query, filter } = validationResult.params!;

  const cacheKey = `trainers:${page}:${pageSize}:${query || ""}:${filter || ""}`;

  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    console.log("CACHE TRAINER HIT");
    return JSON.parse(cachedData) as ActionResponse<{
      trainers: Trainer[];
      isNext: boolean;
    }>;
  }

  console.log("CACHE MISS");

  const where = {
    ...(query && {
      OR: [
        {
          specialization: {
            contains: query,
            mode: "insensitive" as const,
          },
        },
        {
          experience: {
            contains: query,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  let orderBy = {};

  switch (filter) {
    case "oldest":
      orderBy = {
        createdAt: "asc",
      };
      break;
    case "newest":
    default:
      orderBy = {
        createdAt: "desc",
      };
  }

  //pagination
  const skip = (page - 1) * pageSize;

  try {
    const [trainers, totalTrainers] = await Promise.all([
      prisma.trainer.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,

        include: {
          user: {
            select: {
              image: true,
              name: true,
              email: true,
            },
          },
        },
      }),

      prisma.trainer.count({
        where,
      }),
    ]);

    const isNext = totalTrainers > skip + trainers.length;

    const response = {
      success: true,
      data: {
        trainers,
        isNext,
      },
    };

    await redis.set(cacheKey, JSON.stringify(response), "EX", 180);

    return response;
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getTrainerById(params: GetTrainerParams): Promise<ActionResponse<TrainerWithUser>> {
  const validationResult = await action({
    params,
    schema: GetTrainerByIdSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { trainerId } = validationResult.params!;

  try {
    const trainer = await prisma.trainer.findUnique({
      where: {
        id: trainerId,
      },

      include: {
        user: {
          select: {
            image: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });

    if (!trainer) throw new Error("Trainer not found");

    const { user, ...trainerData } = trainer;

    const flattenedTrainer = {
      ...trainerData,
      ...user,
    };

    return {
      success: true,
      data: flattenedTrainer,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(): Promise<ActionResponse<User>> {
  const session = await auth();

  if (!session?.user.id) throw new Error("Unauthorized");
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!existingUser) throw new Error("User not Find");

    return { success: true, data: existingUser };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getCartItems(
  params: GetCartItemsParams
): Promise<ActionResponse<{ productsWithImages: ProductWithImages[]; isNext: boolean }>> {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Need to Login");
  }

  const { userId } = await params!;

  if (session.user.id !== userId) {
    throw new Error("Unauthorized");
  }

  const validationResult = await action({
    params,
    schema: GetCartItemsSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { page = 1, pageSize = 8 } = validationResult.params!;

  const skip = (page - 1) * pageSize;

  try {
    const userCart = await prisma.cart.findUnique({
      where: {
        userId_cartType: {
          userId,
          cartType: "BOOKMARK",
        },
      },

      include: {
        cartItem: {
          skip,
          take: pageSize,
          include: {
          product:{
            include:{
              images: true,
            }
          }
          },
        },
      },
    });

    const cartItems = userCart?.cartItem || [];

    const isNext = cartItems.length > pageSize;

    const products = cartItems.slice(0, pageSize).map((item) => item.product);

    
    return {
      success: true,
      data: {
        productsWithImages: products,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
