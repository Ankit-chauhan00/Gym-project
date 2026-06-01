import ROUTES from "@/constants/routes";
import { fetchHandler } from "./handlers/fectch";
import { SignInWithAuthParams } from "@/types/action";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

export const api = {
  auth: {
    oAuthSignIn: ({ user, provider, providerAccountId }: SignInWithAuthParams) =>
      fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
        method: "POST",
        body: JSON.stringify({ user, provider, providerAccountId }),
      }),
  },
};
