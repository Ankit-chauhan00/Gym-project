import { OrderStatus, PaymentMode, Product, User } from "@prisma/client";
import { PaginatedSearchParams } from "./global";

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

  message?: string;

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
  experience?: string;
  image?: string;
  password: string;
}

interface MembershipParams {
  membershipName: string;
  description?: string;
  membershipPrice: number;
  membershipDuration: number;
  image?: string;
  isActive: boolean;
}

export type Category = "SUPPLEMENTS" | "EQUIPMENTS" | "ACCESSORIES";

export type ProductType =
  | "WHEY_PROTEIN"
  | "MASS_GAINER"
  | "PREWORKOUT"
  | "CREATINE"
  | "BCAA"
  | "MULTIVITAMIN"
  | "FISH_OIL"
  | "SHAKER"
  | "GYM_GLOVES"
  | "RESISTANCE_BAND"
  | "DUMBBELL";

interface CreateProductParams {
  title: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
  modelUrl?: string;
  category: Category;
  productType: ProductType;
}

interface GetTrainerParams {
  trainerId: string;
}

type ProductWithSingleImage = Product & {
  images: string;
};

interface GetFilteredProducts {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  category?: string;
  productType?: string;
}

interface AddToCartParams {
  productId: string;
}

interface GetCartItemsParams extends PaginatedSearchParams {
  userId: string;
}

type ProductWithImages = Prisma.ProductGetPayload<{
  include: {
    images: true;
  };
}>;

interface CreateOrderParams {
  productId: string;

  quantity: number;
  totalAmount: number;

  fullname: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;
  postalCode: string;
  country: string;

  orderStatus?: OrderStatus;
  paymentMode: PaymentMode;
  
}
