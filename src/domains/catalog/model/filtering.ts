import type { Product, Shop } from "./types";

export type ProductsFilter = {
  priceFrom?: number;
  priceTo?: number;
  flowersCountFrom?: number;
  hasDiscount?: boolean;
  colors?: string[];
  hasGift?: boolean;
  /**
   * Используется только в общем каталоге для фильтрации по магазину.
   * На страницах магазина фильтрация по shopId происходит контекстно.
   */
  shopSlug?: string;
};

export type RawSearchParams = Record<string, string | string[] | undefined>;

function toNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function toBoolean(value: string | undefined): boolean | undefined {
  if (!value) return undefined;
  if (value === "true") return true;
  if (value === "false") return false;
  return undefined;
}

function parseColors(value: string | string[] | undefined): string[] | undefined {
  if (typeof value === "undefined") return undefined;

  const values = Array.isArray(value) ? value : [value];

  const result = values
    .flatMap((v) => v.split(","))
    .map((v) => v.trim())
    .filter(Boolean);

  return result.length > 0 ? result : undefined;
}

export function parseProductsFilterFromSearchParams(
  searchParams: RawSearchParams,
): ProductsFilter {
  const priceFrom = toNumber(searchParams.priceFrom as string | undefined);
  const priceTo = toNumber(searchParams.priceTo as string | undefined);
  const flowersCountFrom = toNumber(
    searchParams.flowersCountFrom as string | undefined,
  );

  const hasDiscount = toBoolean(searchParams.hasDiscount as string | undefined);
  const hasGift = toBoolean(searchParams.hasGift as string | undefined);
  const colors = parseColors(searchParams.colors);

  const shopSlug = (searchParams.shopSlug as string | undefined) || undefined;

  return {
    priceFrom,
    priceTo,
    flowersCountFrom,
    hasDiscount,
    colors,
    hasGift,
    shopSlug,
  };
}

export type FilterProductsOptions = {
  /**
   * Полный список магазинов, нужен только для фильтрации по shopSlug.
   */
  shops?: Shop[];
};

export function filterProducts(
  products: Product[],
  filter: ProductsFilter,
  options: FilterProductsOptions = {},
): Product[] {
  const { shops } = options;

  let shopIdForSlug: string | undefined;
  if (filter.shopSlug && shops && shops.length > 0) {
    const shop = shops.find((s) => s.slug === filter.shopSlug);
    shopIdForSlug = shop?.id;
  }

  return products.filter((product) => {
    if (typeof filter.priceFrom === "number" && product.price < filter.priceFrom) {
      return false;
    }

    if (typeof filter.priceTo === "number" && product.price > filter.priceTo) {
      return false;
    }

    if (
      typeof filter.flowersCountFrom === "number" &&
      product.flowersCount < filter.flowersCountFrom
    ) {
      return false;
    }

    if (typeof filter.hasDiscount === "boolean") {
      if (filter.hasDiscount && !product.hasDiscount) return false;
      if (!filter.hasDiscount && product.hasDiscount) return false;
    }

    if (filter.colors && filter.colors.length > 0) {
      const productColors = product.colors.map((c) => c.toLowerCase());
      const requiredColors = filter.colors.map((c) => c.toLowerCase());
      const hasAnyColor = requiredColors.some((color) =>
        productColors.includes(color),
      );
      if (!hasAnyColor) return false;
    }

    if (typeof filter.hasGift === "boolean") {
      const hasGiftInProduct = Boolean(product.gifts && product.gifts.length > 0);
      if (filter.hasGift && !hasGiftInProduct) return false;
      if (!filter.hasGift && hasGiftInProduct) return false;
    }

    if (shopIdForSlug && product.shopId !== shopIdForSlug) {
      return false;
    }

    return true;
  });
}
