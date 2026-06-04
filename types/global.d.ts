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
  isVerified?: boolean;
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
type TrainerWithUser = Trainer & { user: { image: string | null; name: string | null } };

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}