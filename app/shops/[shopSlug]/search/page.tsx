import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllShops,
  getProductsByShopId,
  getShopBySlug,
} from "@/src/domains/catalog/model/repository";
import { searchProducts } from "@/src/domains/catalog/model/search";
import type { RawSearchParams } from "@/src/domains/catalog/model/filtering";
import { SearchResults } from "@/src/domains/catalog/ui/SearchResults";
import { ShopHeader } from "@/src/domains/catalog/ui/ShopHeader";
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
    title: `Поиск букетов — ${shop.name}`,
    description: `Поиск букетов в магазине ${shop.name} в городе ${shop.city}.`,
  };
}

export default async function ShopSearchPage({
  params,
  searchParams,
}: PageProps) {
  const [resolvedParams, resolvedSearchParams, allShops] = await Promise.all([
    params,
    searchParams,
    getAllShops(),
  ]);

  const q = (resolvedSearchParams.q as string | undefined) ?? "";

  const shop = await getShopBySlug(resolvedParams.shopSlug);

  if (!shop) {
    notFound();
  }

  const productsOfShop = await getProductsByShopId(shop.id);

  const results = q.trim()
    ? searchProducts(q, { products: productsOfShop, shops: allShops, shopId: shop.id })
    : [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Каталог", href: "/products" },
          { label: shop.name, href: `/shops/${shop.slug}` },
          { label: "Поиск" },
        ]}
      />

      <ShopHeader shop={shop} />

      <section className="flex flex-col gap-2">
        <h2 className="text-lg font-semibold text-zinc-900">Поиск по букетам магазина</h2>
        <form method="get" className="mt-1 flex gap-2">
          <input
            type="search"
            name="q"
            placeholder="Например, белые розы, коробка с игрушкой..."
            defaultValue={q}
            className="h-9 w-full rounded-md border border-zinc-200 px-3 text-sm outline-none focus:border-zinc-400"
          />
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Найти
          </button>
        </form>
      </section>

      <SearchResults products={results} shops={allShops} query={q} />
    </div>
  );
}
