import type { Product, Shop } from "./types";

export type SearchProductsOptions = {
  products: Product[];
  shops: Shop[];
  /**
   * Если указан, поиск идёт только по товарам конкретного магазина.
   */
  shopId?: string;
};

function normalizeQuery(query: string): string[] {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

export function searchProducts(
  query: string,
  { products, shops, shopId }: SearchProductsOptions,
): Product[] {
  const terms = normalizeQuery(query);
  if (terms.length === 0) return [];

  const shopById = new Map<string, Shop>();
  for (const shop of shops) {
    shopById.set(shop.id, shop);
  }

  return products.filter((product) => {
    if (shopId && product.shopId !== shopId) {
      return false;
    }

    const shop = shopById.get(product.shopId);

    const haystackParts: string[] = [];

    haystackParts.push(product.title.toLowerCase());
    haystackParts.push(product.description.toLowerCase());

    for (const item of product.composition) {
      haystackParts.push(item.flowerType.toLowerCase());
    }

    for (const color of product.colors) {
      haystackParts.push(color.toLowerCase());
    }

    if (product.flowerTypes && product.flowerTypes.length > 0) {
      for (const type of product.flowerTypes) {
        haystackParts.push(type.toLowerCase());
      }
    }

    if (product.stemHeights && product.stemHeights.length > 0) {
      for (const h of product.stemHeights) {
        haystackParts.push(String(h));
      }
    }

    if (shop) {
      haystackParts.push(shop.name.toLowerCase());
    }

    const haystack = haystackParts.join(" ");

    return terms.every((term) => haystack.includes(term));
  });
}
