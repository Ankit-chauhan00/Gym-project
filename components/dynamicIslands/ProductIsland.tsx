"use client";

import { useState } from "react";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import AddToCart from "@/components/cart/AddToCart";
import Link from "next/link";
import ROUTES from "@/constants/routes";
import { Button } from "@/components/ui/button";

interface Props {
  productId: string;
  stock: number;
  price: number;
}

const ProductIsland = ({ productId, stock, price }: Props) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <div className="mt-10">
        <QuantitySelector value={quantity} onChange={setQuantity} max={stock} />
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <AddToCart productId={productId} />

        <Link
          href={`${ROUTES.PRODUCT_BUY_NOW(productId)}?quantity=${quantity}&totalAmount=${quantity * price}`}
        >
          <Button variant="outline" className="h-12 flex-1 rounded-md">
            Buy Now
          </Button>
        </Link>
      </div>
    </>
  );
};

export default ProductIsland;
