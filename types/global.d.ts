import type { DefaultSession } from "next-auth";

type ErrorResponse = ActionResponse<undefined> & { success: false };

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
  }
}

interface PaginatedSearchParams {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
}

interface CreateMemberships {
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  image: string;
}

type SerializedProduct = Omit<Product, "price"> & {
  price: number;
};