import type { Product, Shop } from "@/src/domains/catalog/model/types";
import { ProductsList } from "@/src/domains/catalog/ui/ProductsList";

type SearchResultsProps = {
  products: Product[];
  shops: Shop[];
  query: string;
};

export function SearchResults({ products, shops, query }: SearchResultsProps) {
  if (!query.trim()) {
    return (
      <p className="text-sm text-zinc-500">
        Введите запрос, чтобы найти букет по названию, описанию, составу или
        названию магазина.
      </p>
    );
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        По запросу «{query}» ничего не найдено. Попробуйте изменить формулировку.
      </p>
    );
  }

  return <ProductsList products={products} shops={shops} />;
}

