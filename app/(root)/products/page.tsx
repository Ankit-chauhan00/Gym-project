import ProductCard from "@/components/cards/ProductCard";
import DataRenderer from "@/components/DataRenderer";
import ClearFilters from "@/components/filters/ClearFilters";
import CommonFilters from "@/components/filters/CommonFilters";
import PriceFilter from "@/components/filters/PriceFilter";
import Pagination from "@/components/Pagination";
import LoaclSearch from "@/components/search/LoaclSearch";

import { ProductCategoryFilters, ProductPageFilters, ProductTypeFilters } from "@/constants/filter";
import ROUTES from "@/constants/routes";
import { DEFAULT_EMPTY } from "@/constants/states";
import { getFilteredProducts } from "@/lib/actions/product.action";
import { ProductWithSingleImageProps } from "@/types/global";

import Link from "next/link";

interface SearchParams {
  searchParams: Promise<Record<string, string | undefined>>;
}

const ProductSections = async ({ searchParams }: SearchParams) => {
  const params = await searchParams;

  const { page, pageSize, query, filter, category } = await params;

  const productType = params["product-type"];

  const { success, data, error } = await getFilteredProducts({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 8,
    query: query || "",
    filter: filter || "",
    category: category || "",
    productType: productType || "",
  });

  const products = data?.products || [];
  const isNext = data?.isNext || false;


  

  return (
    <section className="min-h-screen w-full bg-white py-20 text-slate-950 transition-colors duration-300 dark:bg-black dark:text-white">
      <div className="flex min-h-full flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl dark:text-white">
              Products
            </h1>
            <p className="mt-4 max-w-2xl text-xl leading-relaxed text-slate-600 sm:text-2xl dark:text-slate-400">
              Browse our premium fitness products and explore gear, recovery tools, and essentials built for athletes.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-3 lg:grid-cols-[1.4fr_0.6fr]">
            <LoaclSearch
              route="/products"
              imgSrc="/icons/search.svg"
              placeholder="Search products..."
              iconPosition="right"
              otherClasses="w-full border border-slate-200 bg-white/90 text-slate-900 outline-none shadow-sm dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-white"
            />
            <CommonFilters filters={ProductPageFilters} otherClasses="w-full" placeholder="Sort by:" />
          </div>

          <div className="rounded-md border border-slate-200 bg-slate-100/80 p-2 shadow-sm backdrop-blur-sm sm:gap-2 dark:border-zinc-800 dark:bg-zinc-950/90">
            <div className="flex flex-wrap items-center justify-between">
              <div className="flex h-20 w-50 flex-col items-center justify-center gap-2 rounded-md bg-white/90 p-4 shadow-sm dark:bg-zinc-900/90">
                <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                  Category
                </p>
                <CommonFilters
                  filters={ProductCategoryFilters}
                  otherClasses="w-full"
                  placeholder="Category"
                  filterKey="category"
                />
              </div>

              <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-white/90 p-4 shadow-sm dark:bg-zinc-900/90">
                <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                  Product Type
                </p>
                <CommonFilters
                  filters={ProductTypeFilters}
                  otherClasses="w-full"
                  placeholder="Product Type"
                  filterKey="product-type"
                />
              </div>

              <div className="flex h-20 flex-col items-center justify-center gap-1 rounded-md bg-white/90 p-6 shadow-sm dark:bg-zinc-900/90">
                <p className="text-sm font-semibold tracking-[0.2em] text-slate-500 uppercase dark:text-slate-400">
                  Price Range
                </p>
                <PriceFilter />
              </div>

              <div className="flex items-end justify-start rounded-md bg-white/90 p-4 text-white shadow-sm dark:bg-zinc-900/90 dark:text-black">
                <ClearFilters />
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-wrap justify-between gap-3">
          <DataRenderer
            success={success}
            error={error}
            data={products}
            empty={DEFAULT_EMPTY}
            render={(products: ProductWithSingleImageProps[]) => (
              <div className="flex flex-wrap items-center justify-center gap-5">
                {products.map((product) => (
                  <Link key={product.id} href={ROUTES.PRODUCT(product.id)}>
                    <ProductCard data={product} />
                  </Link>
                ))}
              </div>
            )}
          />
          <Pagination isNext={isNext} page={page} />
        </div>
      </div>
    </section>
  );
};

export default ProductSections;
