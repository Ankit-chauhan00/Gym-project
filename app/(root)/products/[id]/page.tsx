import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/QuantitySelector";

import { BadgeCheck, ShieldCheck, Truck} from "lucide-react";

import { FiShoppingCart } from "react-icons/fi";
import { TbHexagon3D } from "react-icons/tb";

import { GetProduct } from "@/lib/actions/product.action";
import ProductImageGallery from "@/components/product/ProductImageGallery";

interface ProductDetailsParams {
  params: { id: string };
}

const ProductDetails = async ({ params }: ProductDetailsParams) => {
  const { id } = await params;
  const { success, data: product } = await GetProduct({ productId: id });

  if (!success || !product) {
    return (
      <section className="flex min-h-screen items-center justify-center">
        <h2 className="text-3xl font-bold">Product Not Found</h2>
      </section>
    );
  }

  const { title, description, price, stock, modelUrl, productType, images, category } = product!;

  return (
    <section className="w-full px-4 py-10 pt-20 md:px-8 lg:px-16">
      {/* breadcrumb */}
      <div className="mb-8 text-sm text-zinc-500">
        Home / {product.category} / <span className="text-white">{product.title}</span>
      </div>

      {/* main section */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* LEFT IMAGES */}
        <div className="flex flex-col gap-4">
          {/* Main image */}

          {/* image gallery */}
          <ProductImageGallery images={images} title={title} />
        </div>

        {/* RIGHT CONTENT */}
        <div className="flex flex-col">
          {/* title */}
          <div className="flex flex-col gap-2">
            <p className="text-sm tracking-widest text-red-500 uppercase">{product.category}</p>

            <h1 className="font-iceland text-5xl leading-none md:text-6xl">{product.title}</h1>

            <p className="max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{product.description}</p>
          </div>

          {/* reviews */}
          <div className="mt-5 flex items-center gap-2">
            <p className="text-sm text-zinc-500">{description}</p>
          </div>

          {/* price */}
          <div className="mt-6 flex items-center gap-4">
            <h2 className="text-2xl text-red-500">₹{Number(price)}</h2>

            <span className="rounded-1.5 border border-green-500 px-3 py-1 text-sm text-green-500">
              In Stock ({stock})
            </span>
          </div>

          {/* features */}
          <div className="mt-8 flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Features</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-1.5 flex items-center gap-3 border border-zinc-200 p-4 dark:border-zinc-800">
                <BadgeCheck className="text-red-500" />
                <p>Premium Quality Product</p>
              </div>

              <div className="rounded-1.5 flex items-center gap-3 border border-zinc-200 p-4 dark:border-zinc-800">
                <ShieldCheck className="text-red-500" />
                <p>Authentic Verified Brand</p>
              </div>

              <div className="rounded-1.5 flex items-center gap-3 border border-zinc-200 p-4 dark:border-zinc-800">
                <Truck className="text-red-500" />
                <p>Fast Delivery Available</p>
              </div>

              <div className="rounded-1.5 flex items-center gap-3 border border-zinc-200 p-4 dark:border-zinc-800">
                <BadgeCheck className="text-red-500" />
                <p>Best Seller Product</p>
              </div>
            </div>
          </div>

          {/* quantity */}
          <div className="mt-10">
            <QuantitySelector />
          </div>

          {/* actions */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row">
            <Button className="h-12 flex-1 rounded-md bg-red-600 text-white hover:bg-red-700">
              <div className="flex items-center gap-2">
                <FiShoppingCart size={20} />
                <span className="font-semibold">Add To Cart</span>
              </div>
            </Button>

            <Button variant="outline" className="h-12 flex-1 rounded-md border-zinc-300 dark:border-zinc-700">
              Buy Now
            </Button>
          </div>

          {/* extra */}
          <div className="mt-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <div className="flex flex-col gap-3 text-sm text-zinc-600 dark:text-zinc-400">
              <p>
                Category :<span className="ml-2 font-medium text-black dark:text-white">{category}</span>
              </p>

              <p>
                Product Type :<span className="ml-2 font-medium text-black dark:text-white">{product.productType}</span>
              </p>

              {modelUrl && <Button className="">
                <TbHexagon3D size={22} /> 3D View
              </Button>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
