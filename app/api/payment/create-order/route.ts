export const runtime = "nodejs";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_API_KEY!,
  key_secret: process.env.RAZORPAY_TEST_API_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
   
    const body = await req.json();
    const { totalAmount, paymentMethod, orderId } = body.payload;

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Amount",
        },
        { status: 500 }
      );
    }

    const order = await razorpay.orders.create({
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `recipt_${Date.now()}`,
    });

    await prisma.payment.create({
      data: {
        paymentMethod,
        razorPayOrderId: order.id,
        orderId,
        amount: totalAmount * 100, // amount is stored in paisa or cents
        status: "PROCESSING",
      },
    });

    return NextResponse.json({
      success: true,
      order,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
