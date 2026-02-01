import type { Metadata } from "next";

import { getAllProducts, getAllShops } from "@/src/domains/catalog/model/repository";
import {
  filterProducts,
  parseProductsFilterFromSearchParams,
  sortProducts,
  type RawSearchParams,
} from "@/src/domains/catalog/model/filtering";
import { ProductsList } from "@/src/domains/catalog/ui/ProductsList";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { ProductsFilters } from "@/src/domains/catalog/ui/ProductsFilters";

type PageSearchParams = RawSearchParams;

type PageProps = {
  searchParams: Promise<PageSearchParams>;
};

export const metadata: Metadata = {
  title: "Каталог букетов — все магазины",
  description:
    "Все букеты из цветочных магазинов Алматы: розы, тюльпаны, орхидеи. Фильтры по цене, цвету, скидкам и подаркам.",
};

export default async function ProductsPage({ searchParams }: PageProps) {
  const [resolvedSearchParams, products, shops] = await Promise.all([
    searchParams,
    getAllProducts(),
    getAllShops(),
  ]);

  const filter = parseProductsFilterFromSearchParams(resolvedSearchParams);

  const filteredProducts = filterProducts(products, filter, { shops });
  const sortedProducts = sortProducts(filteredProducts, filter.sort);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8">
      <Breadcrumbs items={[{ label: "Каталог", href: "/products" }]} />

      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Каталог букетов во всех магазинах
        </h1>
        <p className="text-sm text-zinc-600">
          Используйте фильтры, чтобы подобрать букет по цене, количеству цветов,
          наличию скидки, подарка и цветовой гамме.
        </p>
      </header>

      <ProductsFilters
        searchParams={resolvedSearchParams}
        shops={shops}
        showShopSelect
      />

      <ProductsList products={sortedProducts} shops={shops} />
    </div>
  );
}
