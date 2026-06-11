import prisma from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_TEST_API_KEY!,
  key_secret: process.env.RAZORPAY_TEST_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    console.log("VERIFY ROUTE HIT");

    const body = await req.json();

    console.log("PARSED BODY: ",body)

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature} = body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_TEST_API_SECRET!)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid signature",
        },
        { status: 400 }
      );
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        razorPayOrderId: razorpay_order_id,
        status: "PROCESSING",
      },
    });

    if (!existingPayment) {
      return NextResponse.json({ success: false, message: "Payment dosent exist" });
    }

    const payment = await razorpay.payments.fetch(razorpay_payment_id);

    if (
      payment.status === "captured" &&
      payment.amount === existingPayment?.amount && // as  we are storing the paisa id db so no need to mustiply with 100 as alrey comming in paise both
      payment.order_id === razorpay_order_id
    ) {
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: existingPayment.id,
          },
          data: {
            transactionId: razorpay_payment_id,
            status: "COMPLETED",
          },
        });

        const order = await tx.order.findUnique({
          where:{
            id:existingPayment.orderId
          }
        })

        if(!order || order.orderStatus !== "PENDING"){
          throw new Error("Order Alredy Processed");
        }

        await tx.order.update({
          where:{
            id:order.id
          },
          data:{
            orderStatus: OrderStatus.PAID
          }
        })
      });
      return NextResponse.json({ success: true, message: "payment completed" });
    }

    return NextResponse.json({ success: false, message: payment.status });
  } catch (error) {
    console.log("VERIFY API ERROR: " , error);
    return NextResponse.json({ success: false, error: "Verification Failed" }, { status: 500 });
  }
}
