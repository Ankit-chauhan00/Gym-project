import { Category,  ProductType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/client";
import Image from "next/image";
import React from "react";

interface ProductImage {
  imageUrl: string;
}

interface ProductCardProps {
  data: {
    id: string;
    title: string;
    price: Decimal;
    stock: number;
    category: Category | null;
    productType: ProductType | null;
    images: ProductImage[];
  };
}

const ProductCard = ({ data: { title, price, category, images } }: ProductCardProps) => {
  const imageUrl = images?.[0]?.imageUrl || "/placeholder.png";

  return (
    <div className="group flex w-[320px] flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md">
      {/* Image Section */}
      <div className="relative h-[320px] w-full overflow-hidden bg-gray-100">
        <Image fill src={imageUrl} alt={title} className="object-cover transition duration-300 group-hover:scale-105" />
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">{category}</p>

          <h3 className="line-clamp-2 text-lg font-semibold text-gray-900">{title}</h3>

          <p className="text-xl font-bold text-black">₹{Number(price).toFixed(2)}</p>
        </div>

        <button className="mt-auto w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-gray-800">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
