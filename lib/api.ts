import ROUTES from "@/constants/routes";
import { fetchHandler } from "./handlers/fectch";
import { SignInWithAuthParams } from "@/types/action";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

interface VerifyPaymentPayload{
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface CreateRazorPayPayment{
  totalAmount: number,
  paymentMethod: "RAZORPAY";
  orderId: string;
}

export const api = {
  auth: {
    oAuthSignIn: ({ user, provider, providerAccountId }: SignInWithAuthParams) =>
      fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
        method: "POST",
        body: JSON.stringify({ user, provider, providerAccountId }),
      }),
  },

  payment: {
    createRazorPayOrder: (payload: CreateRazorPayPayment) =>
      fetchHandler(`${API_BASE_URL}/payment/create-order`, {
        method: "POST",
        body: JSON.stringify({ payload}),
      }),

    verifyRazorPayPayment: (payload: VerifyPaymentPayload) =>
      fetchHandler(`${API_BASE_URL}/payment/verify-payment`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  },
};
