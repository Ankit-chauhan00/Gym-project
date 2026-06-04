"use server";

import { ActionResponse, GetTrainerParams } from "@/types/action";
import { ErrorResponse, PaginatedSearchParams, TrainerWithUser } from "@/types/global";
import { Trainer } from "@prisma/client";
import action from "../handlers/actions";
import { GetTrainerByIdSchema, PaginatedSearchParamsSchema } from "../validation";
import handleError from "../handlers/error";
import prisma from "../prisma";
import { redis } from "@/lib/redis";

export async function getSavedTrainers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ trainers: Trainer[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  if (validationResult instanceof Error) return handleError(validationResult) as ErrorResponse;

  const { page = 1, pageSize = 1, query, filter } = validationResult.params!;

  const cacheKey = `trainers:${page}:${pageSize}:${query || ""}:${filter || ""}`;

  const cachedData = await redis.get(cacheKey);

  if (cachedData) {
    console.log("CACHE HIT")
    return JSON.parse(cachedData) as ActionResponse<{
      trainers: Trainer[];
      isNext: boolean;
    }>;
  }

  console.log("CACHE MISS")

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
