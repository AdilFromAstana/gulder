import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllShops,
  getProductsByShopId,
  getShopBySlug,
} from "@/src/domains/catalog/model/repository";
import {
  filterProducts,
  parseProductsFilterFromSearchParams,
  type RawSearchParams,
} from "@/src/domains/catalog/model/filtering";
import { ShopHeader } from "@/src/domains/catalog/ui/ShopHeader";
import { ProductsFilters } from "@/src/domains/catalog/ui/ProductsFilters";
import { ProductsList } from "@/src/domains/catalog/ui/ProductsList";
import { ShopMap } from "@/src/shared/ui/ShopMap";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";

type PageParams = {
  shopSlug: string;
};

type PageSearchParams = RawSearchParams;

type PageProps = {
  params: Promise<PageParams>;
  searchParams: Promise<PageSearchParams>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const shop = await getShopBySlug(resolvedParams.shopSlug);
  if (!shop) {
    return {
      title: "Магазин не найден",
    };
  }

  return {
    title: `${shop.name} — цветочный магазин в ${shop.city}`,
    description: shop.description,
  };
}

export default async function ShopPage({ params, searchParams }: PageProps) {
  const [resolvedParams, resolvedSearchParams, allShops] = await Promise.all([
    params,
    searchParams,
    getAllShops(),
  ]);

  const shop = await getShopBySlug(resolvedParams.shopSlug);

  if (!shop) {
    notFound();
  }

  const shopProducts = await getProductsByShopId(shop.id);

  const filter = parseProductsFilterFromSearchParams(resolvedSearchParams);
  // На странице магазина игнорируем filter.shopSlug, так как магазин уже задан в params.
  const { shopSlug: _ignoredShopSlug, ...filterWithoutShop } = filter;

  const filteredProducts = filterProducts(shopProducts, filterWithoutShop);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Каталог", href: "/products" },
          { label: shop.name },
        ]}
      />

      <ShopHeader shop={shop} />

      <ShopMap shop={shop} />

      <ProductsFilters
        searchParams={resolvedSearchParams}
        shops={allShops}
      />

      <ProductsList products={filteredProducts} shops={allShops} />
    </div>
  );
}
