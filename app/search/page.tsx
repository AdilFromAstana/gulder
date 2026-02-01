import type { Metadata } from "next";

import { getAllProducts, getAllShops } from "@/src/domains/catalog/model/repository";
import { searchProducts } from "@/src/domains/catalog/model/search";
import type { RawSearchParams } from "@/src/domains/catalog/model/filtering";
import { SearchResults } from "@/src/domains/catalog/ui/SearchResults";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";

type PageSearchParams = RawSearchParams;

type PageProps = {
  searchParams: Promise<PageSearchParams>;
};

export const metadata: Metadata = {
  title: "Поиск букетов",
  description:
    "Поиск букетов по всем магазинам: по названию, описанию, составу, цветам и названию магазина.",
};

export default async function SearchPage({ searchParams }: PageProps) {
  const [resolvedSearchParams, products, shops] = await Promise.all([
    searchParams,
    getAllProducts(),
    getAllShops(),
  ]);

  const q = (resolvedSearchParams.q as string | undefined) ?? "";

  const results = q.trim()
    ? searchProducts(q, { products, shops })
    : [];

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Каталог", href: "/products" },
          { label: "Поиск" },
        ]}
      />

      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-zinc-900">Поиск по букетам</h1>
        <p className="text-sm text-zinc-600">
          Ищем по названию и описанию букета, типу цветов, цветам и названию
          магазина.
        </p>

        <form method="get" className="mt-2 flex gap-2">
          <input
            type="search"
            name="q"
            placeholder="Например, красные розы, тюльпаны, орхидеи..."
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
      </header>

      <SearchResults products={results} shops={shops} query={q} />
    </div>
  );
}
