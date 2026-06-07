"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  title: string;
}

const ProductImageGallery = ({
  images,
  title,
}: ProductImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(
    images[0]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="overflow-hidden border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
        <Image
          src={selectedImage}
          alt={title}
          width={700}
          height={700}
          priority
          className="h-[350px] w-full object-cover transition-all duration-300 md:h-[500px]"
        />
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-4">
        {images.map((image, index) => {
          const isActive = selectedImage === image;

          return (
            <button
              key={index}
              onClick={() => setSelectedImage(image)}
              className={`overflow-hidden border transition-all duration-200 ${
                isActive
                  ? "border-red-500"
                  : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <Image
                src={image}
                alt={`${title}-${index}`}
                width={200}
                height={200}
                className="h-24 w-full object-cover"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductImageGallery;

