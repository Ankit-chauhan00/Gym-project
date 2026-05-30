import { User } from "@/generated/prisma/client";

interface SignInWithAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
  };
}

type SafeUser = Omit<User, "password">;
interface ActionResponse<T = null> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface AdminCreationParams {
  name: string;
  username: string;
  email: string;
  password: string;
  image?: string;
}

export type SafeUser = Omit<User, "password">;

interface CreateTrainerParams {
  email: string;
  username: string;
  specialization?: string;
  phone?: string;
  experience?:string;
  image?:string;
  password: string;
}
