import { SiSpringsecurity } from "react-icons/si";
import { TbTruckDelivery } from "react-icons/tb";
import { FaCheckCircle } from "react-icons/fa";
import { RiCustomerServiceFill } from "react-icons/ri";
import DeliveryForms from "@/components/forms/DeliveryForms";
import { BiSolidCartAlt } from "react-icons/bi";
import { BiCheckShield } from "react-icons/bi";

const BuyNowPage = () => {
  return (
    <section className="w-full">
      <main className="mt-15 flex w-full flex-col gap-5 p-5">
        <h2 className="font-iceland text-xl font-medium opacity-70 md:text-2xl lg:text-3xl">
          Home/Products/title of product/<span className="font-bold text-red-600">Buy Now</span>
        </h2>
        {/* Mid Section Form   */}
        <div className="grid items-start gap-6 md:grid-cols-[510px_1fr]">
          <DeliveryForms

            defaultValues={{
              fullname: "",
              phoneNumber: "",
              addressLine1: "",
              addressLine2: "",
              city: "",
              state: "",
              postalCode: "",
              country: "",
            }}
          />

          <div className="sticky top-24 w-full self-start lg:-mt-16">
            <div className="w-full max-w-md rounded-md border-2 p-2">
              <h2 className="font-iceland flex items-center border-b py-4 text-3xl md:text-4xl">
                <BiSolidCartAlt size={35} className="mr-2 ml-2 text-red-600" />
                <span className="opacity-70">Order Summary</span>
              </h2>

              <div className="mt-3 flex flex-col gap-3 border-b p-2 md:mt-10">
                <div className="font-asap flex flex-row justify-between">
                  <p className="opacity-60">Price (1 Item)</p>
                  <p>2999</p>
                </div>

                <div className="font-asap flex flex-row justify-between">
                  <p className="opacity-60">Shipping</p>
                  <p className="text-green-600">FREE</p>
                </div>

                <div className="font-asap flex flex-row justify-between">
                  <p className="opacity-60">Tax</p>
                  <p className="">18%</p>
                </div>
              </div>

              <div className="mt-3 flex flex-col gap-3 border-b p-2 md:mt-10">
                <div className="font-asap bold flex flex-row justify-between">
                  <h2 className="text-2xl">Total Amount</h2>
                  <div className="flex flex-row items-center gap-1 text-red-600">
                    <span className="text-2xl md:text-4xl">₹</span>
                    <p className="text-2xl font-extrabold md:text-3xl">2999</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-col items-start gap-3 p-2 md:mt-10">
                <div className="flex flex-row items-center justify-center gap-5">
                  <BiCheckShield className="font-extraligh size-6 text-red-600 md:size-10" />
                  <p>Premium Quality Products</p>
                </div>

                <div className="flex flex-row items-center justify-center gap-5">
                  <BiCheckShield className="font-extraligh size-6 text-red-600 md:size-10" />
                  <p>Authentic Verified Brand</p>
                </div>
                <div className="flex flex-row items-center justify-center gap-5">
                  <BiCheckShield className="font-extraligh size-6 text-red-600 md:size-10" />
                  <p>Best Seller Productas</p>
                </div>
                <div className="flex flex-row items-center justify-center gap-5">
                  <BiCheckShield className="size-6 font-extralight text-red-600 md:size-10" />
                  <p>Secure Payments</p>
                </div>

                <div className="flex flex-row items-center justify-center gap-5">
                  <BiCheckShield className="font-extraligh size-6 text-red-600 md:size-10" />
                  <p>Discount Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="flex w-full rounded-md border-2">
          <div className="flex w-full flex-col gap-5 p-3 md:flex-row md:justify-between">
            <div className="rounded-1.5 flex gap-1 border p-2">
              <SiSpringsecurity className="size-10 text-red-600 lg:size-16" />
              <div className="font-asap flex flex-col justify-center">
                <h3 className="text-xl opacity-80">Secue Payment</h3>
                <p className="text-sm opacity-60">Your payment are safe with us</p>
              </div>
            </div>
            <div className="rounded-1.5 flex gap-1 border p-2">
              <TbTruckDelivery className="size-10 text-red-600 lg:size-16" />
              <div className="font-asap flex flex-col justify-center">
                <h3 className="text-xl opacity-80">Fast Delivery</h3>
                <p className="text-sm opacity-60">Get your order deliverd Quickly</p>
              </div>
            </div>
            <div className="rounded-1.5 flex gap-1 border p-2">
              <FaCheckCircle className="size-10 text-red-600 lg:size-16" />
              <div className="font-asap flex flex-col justify-center">
                <h3 className="text-xl opacity-80">100% Orignal</h3>
                <p className="text-sm opacity-60">We Only send authentic products</p>
              </div>
            </div>
            <div className="rounded-1 flex gap-1 border p-2">
              <RiCustomerServiceFill className="size-10 text-red-600 lg:size-16" />
              <div className="font-asap flex flex-col justify-center">
                <h3 className="text-xl opacity-80">Customer Support</h3>
                <p className="text-sm opacity-60">24x7 support for any help you need</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default BuyNowPage;
