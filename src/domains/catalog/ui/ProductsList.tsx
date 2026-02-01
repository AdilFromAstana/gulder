import type { Product, Shop } from "@/src/domains/catalog/model/types";
import { ProductCard } from "@/src/domains/catalog/ui/ProductCard";

type ProductsListProps = {
  products: Product[];
  shops: Shop[];
};

export function ProductsList({ products, shops }: ProductsListProps) {
  const shopById = new Map<string, Shop>();
  for (const shop of shops) {
    shopById.set(shop.id, shop);
  }

  if (products.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        По заданным параметрам ничего не найдено. Попробуйте изменить фильтры.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative transform-none">
      {products.map((product) => {
        const shop = shopById.get(product.shopId);
        if (!shop) return null;

        return <ProductCard key={product.id} product={product} shop={shop} />;
      })}
    </div>
  );
}

