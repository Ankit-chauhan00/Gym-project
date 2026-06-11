"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Controller, useForm } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { SelectTrigger, SelectValue, SelectContent, SelectItem, Select } from "../ui/select";
import { Country, State, City } from "country-state-city";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GiCash } from "react-icons/gi";
import { MdOutlinePayment } from "react-icons/md";
import { FaRegAddressCard } from "react-icons/fa";
import { OrderStatus, PaymentMode } from "@prisma/client";
import { Button } from "../ui/button";
import { RazorpayResponse } from "@/types/global";
import { createOrderFormSchema } from "@/lib/validation";
import { createOrder } from "@/lib/actions/order.action";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ROUTES from "@/constants/routes";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  order_id: string;

  handler: (response: RazorpayResponse) => Promise<void>;
}

interface DefaultValuesParams {
  fullname: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;
  postalCode: string;
  country: string;
}

type DeliveryFormValues = DefaultValuesParams & {
  paymentMode: PaymentMode;
};

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

interface DeliveryFormProps {
  defaultValues: DefaultValuesParams;
}

const DeliveryForms = ({ defaultValues }: DeliveryFormProps) => {
  const schema = createOrderFormSchema;
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const productId = params.id as string;

  const quantity = Number(searchParams.get("quantity") ?? 1);

  const totalAmount = Number(searchParams.get("totalAmount") ?? 0);

  const form = useForm<DeliveryFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: {
      ...defaultValues,
      paymentMode: "COD",
    },
  });

  const [selectedCountry, setselectedCountry] = useState("");
  const [selectedState, setselectedState] = useState("");
  const cities = City.getCitiesOfState(selectedCountry, selectedState);

  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(selectedCountry);

  const handleSubmit = async (data: DeliveryFormValues) => {
    const payload: CreateOrderParams = {
      ...data,

      productId,
      quantity,
      totalAmount,
    };
    const { success, data: order } = await createOrder(payload);

    if (!success || !order) {
      toast.error("unable to place the order");
      return;
    }

    if (order.paymentMode === "COD") {
      toast.success("Order Placed");
      return;
    }

    if (order.paymentMode === "PREPAID") {
      const payment = await api.payment.createRazorPayOrder({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentMethod: "RAZORPAY",
      });

      if (!payment.success) {
        toast.error("Unable to initialize payment");

        return;
      }

      const razorpayOrder = payment.order;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency: razorpayOrder.currency,

        order_id: razorpayOrder.id,

        handler: async function (response: RazorpayResponse) {
          
          router.replace(ROUTES.PRODUCT(productId));

          const verifyPayment = await api.payment.verifyRazorPayPayment({
            razorpay_order_id: response.razorpay_order_id,

            razorpay_payment_id: response.razorpay_payment_id,

            razorpay_signature: response.razorpay_signature,
          });


          if (verifyPayment.success) {
            toast.success("Payment Successful");
          } else {
            toast.error("Payment verification failed");
          }
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.open();
    }
  };

  return (
    <Card className="max-w-xl rounded-md border shadow-2xl shadow-slate-950/20">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2 text-2xl md:text-3xl">
          <span className="rounded-md bg-red-600 px-2 py-1">
            <FaRegAddressCard className="text-black" />
          </span>{" "}
          Delivery Address
        </CardTitle>
      </CardHeader>
      <CardContent className=" ">
        <form id="delivery-form" onSubmit={form.handleSubmit(handleSubmit)} className="grid">
          <div className="flex flex-col gap-2 md:flex-row">
            <Field>
              <FieldLabel className="font-iceland text-2xl opacity-70">Full Name</FieldLabel>

              <Input
                {...form.register("fullname")}
                placeholder="Enter your Name"
                autoComplete="name"
                className="rounded-md"
              />
            </Field>
            <Field>
              <FieldLabel className="font-iceland text-2xl opacity-70">Phone Number</FieldLabel>

              <Input
                {...form.register("phoneNumber")}
                placeholder="Enter your Number"
                autoComplete="tel"
                className="rounded-md"
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <Field>
              <FieldLabel className="font-iceland text-2xl opacity-70">Address Line 1</FieldLabel>

              <Input
                {...form.register("addressLine1")}
                placeholder="Enter your Address 1"
                autoComplete="address-line1"
                className="rounded-md"
              />
            </Field>

            <Field>
              <FieldLabel className="font-iceland text-2xl opacity-70">Address Line 2</FieldLabel>

              <Input
                {...form.register("addressLine2")}
                placeholder="Enter your Address 2"
                autoComplete="address-line2"
                className="rounded-md"
              />
            </Field>
          </div>

          <div className="mt-5 flex flex-col gap-2">
            <div className="flex flex-col gap-2 md:flex-row">
              <Field>
                <FieldLabel className="font-iceland text-2xl opacity-70">Country</FieldLabel>

                <Controller
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        setselectedCountry(value);
                        setselectedState("");

                        form.setValue("state", "");
                        form.setValue("city", "");

                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>

                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.isoCode} value={country.isoCode}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel className="font-iceland text-2xl opacity-70">State</FieldLabel>

                <Controller
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        setselectedState(value);

                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>

                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </div>

            <div className="flex flex-col gap-2 md:flex-row">
              <Field>
                <FieldLabel className="font-iceland text-2xl opacity-70">City</FieldLabel>

                <Controller
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Country" />
                      </SelectTrigger>

                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel className="font-iceland text-2xl opacity-70">Postal Code</FieldLabel>

                <Input
                  {...form.register("postalCode")}
                  autoComplete="postal-code"
                  placeholder="Enter the Postal Code"
                />
              </Field>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <FieldLabel className="font-iceland text-2xl opacity-70">Payment Method</FieldLabel>

            <Controller
              control={form.control}
              name="paymentMode"
              defaultValue="COD"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={(value) => field.onChange(value)}
                  className="grid gap-3 md:grid-cols-2"
                >
                  <div className="flex items-center gap-3 rounded-xl border px-3 py-2">
                    <RadioGroupItem value="COD" id="cod" />

                    <label htmlFor="cod" className="flex cursor-pointer items-center gap-2">
                      <div className="flex items-center gap-1">
                        <GiCash className="text-red-600" size={25} />
                        Cash On Delivery
                      </div>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border px-3 py-2">
                    <RadioGroupItem value="PREPAID" id="prepaid" />

                    <label htmlFor="prepaid" className="flex cursor-pointer items-center gap-2">
                      <div className="flex items-center gap-1">
                        <MdOutlinePayment className="text-red-600" size={25} />
                        Online
                      </div>
                    </label>
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-4 sm:gap-5 sm:pt-6">
        <div className="">
          <Button
            className="flex-1 bg-gray-200 px-4 py-2 font-bold text-black transition-colors hover:bg-gray-300 sm:flex-none sm:px-6 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
            type="button"
            onClick={() => {
              form.reset();
              setselectedCountry("");
              setselectedState("");
            }}
          >
            Reset
          </Button>
          <Button
            className="flex-1 bg-red-600 px-4 py-2 font-bold text-white transition-colors hover:bg-red-600 sm:flex-none sm:px-6"
            type="submit"
            form="delivery-form"
            onClick={() => console.log("Button is clicked")}
          >
            Place Order
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DeliveryForms;
