import ProductCard from "@/components/cards/ProductCard";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import ROUTES from "@/constants/routes";
import { DEFAULT_EMPTY } from "@/constants/states";
import { getCartItems } from "@/lib/actions/user.action";
import { ProductWithImages } from "@/types/action";
import { RouteParams } from "@/types/global";
import { Product } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

const CartItems = async ({ params }: RouteParams) => {
  const { id } = await params;
  const page = 1;
  const pageSize = 8;
  const { data, success, error,  } = await getCartItems({ userId: id, page, pageSize });
  if (!data) {
    toast.error("No cart item Added yet");
  }

  const {productsWithImages, isNext} = data!;

  

  return (
    <section className="flex min-h-full w-full">
      <div className="mt-20 flex">
        <div className="flex flex-col pl-5">
          <h1 className="font-iceland text-4xl md:text-6xl">Cart Items</h1>

          <div className="mt-10 flex items-center ">
            <DataRenderer
            empty={DEFAULT_EMPTY}
              success={success}
              error={error}
              data={productsWithImages}
              render={(products: ProductWithImages[]) => (
                <div className="flex flex-wrap gap-10">
                  {products.map((product) => (
                    <Link key={product.id} href={ROUTES.PRODUCT(product.id)}>
                    <ProductCard  data={product} />
                    </Link>
                  ))}
                </div>
              )}
            />
          </div>

          <Pagination containerClasses="mt-10 items-center justify-center" page={page} isNext={isNext}/>
        </div>
      </div>
    </section>
  );
};

export default CartItems;
