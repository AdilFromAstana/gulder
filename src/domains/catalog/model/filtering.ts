import type { Product, Shop } from "./types";

export type SortOption = "priceAsc" | "priceDesc" | "ratingDesc";

export type ProductsFilter = {
  priceFrom?: number;
  priceTo?: number;
  flowersCountFrom?: number;
  /** Полосы количества цветов (приоритетнее, чем flowersCountFrom). */
  flowersCountRange?: "lt11" | "11-31" | "31-61" | "61-91" | "gt91";
  hasDiscount?: boolean;
  colors?: string[];
  stemHeights?: number[];
  flowerTypes?: string[];
  hasGift?: boolean;
  /**
   * Используется только в общем каталоге для фильтрации по магазину.
   * На страницах магазина фильтрация по shopId происходит контекстно.
   */
  shopSlug?: string;
  /**
   * Сортировка результатов. Всегда выставляется парсером; по умолчанию — priceAsc.
   */
  sort: SortOption;
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

function parseStemHeights(value: string | string[] | undefined): number[] | undefined {
  if (typeof value === "undefined") return undefined;
  const values = Array.isArray(value) ? value : [value];
  const result = values
    .flatMap((v) => v.split(","))
    .map((v) => Number(v.trim()))
    .filter((n) => Number.isFinite(n));
  return result.length > 0 ? result : undefined;
}

function parseFlowersCountRange(
  value: string | undefined,
): ProductsFilter["flowersCountRange"] | undefined {
  if (!value) return undefined;
  const allowed: ProductsFilter["flowersCountRange"][] = [
    "lt11",
    "11-31",
    "31-61",
    "61-91",
    "gt91",
  ];
  return allowed.includes(value as ProductsFilter["flowersCountRange"]) ? value as ProductsFilter["flowersCountRange"] : undefined;
}

function parseSortOption(value: string | undefined): SortOption {
  if (!value) return "priceAsc";

  const allowed: SortOption[] = ["priceAsc", "priceDesc", "ratingDesc"];
  return allowed.includes(value as SortOption) ? (value as SortOption) : "priceAsc";
}

function parseFlowerTypes(
  value: string | string[] | undefined,
): string[] | undefined {
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
  const flowersCountRange = parseFlowersCountRange(
    searchParams.flowersCountRange as string | undefined,
  );

  const hasDiscount = toBoolean(searchParams.hasDiscount as string | undefined);
  const hasGift = toBoolean(searchParams.hasGift as string | undefined);
  const colors = parseColors(searchParams.colors);
  const stemHeights = parseStemHeights(searchParams.stemHeights);
  const flowerTypes = parseFlowerTypes(searchParams.flowerTypes);

  const shopSlug = (searchParams.shopSlug as string | undefined) || undefined;
  const sort = parseSortOption(searchParams.sort as string | undefined);

  return {
    priceFrom,
    priceTo,
    flowersCountFrom,
    flowersCountRange,
    hasDiscount,
    colors,
    stemHeights,
    flowerTypes,
    hasGift,
    shopSlug,
    sort,
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

    if (filter.flowersCountRange) {
      const count = product.flowersCount;
      const range = filter.flowersCountRange;
      const inRange =
        (range === "lt11" && count < 11) ||
        (range === "11-31" && count >= 11 && count < 31) ||
        (range === "31-61" && count >= 31 && count < 61) ||
        (range === "61-91" && count >= 61 && count < 91) ||
        (range === "gt91" && count >= 91);

      if (!inRange) return false;
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

    if (filter.stemHeights && filter.stemHeights.length > 0) {
      const productHeights = product.stemHeights;
      const hasAnyHeight = filter.stemHeights.some((h) => productHeights.includes(h));
      if (!hasAnyHeight) return false;
    }

    if (filter.flowerTypes && filter.flowerTypes.length > 0) {
      const productFlowerTypes = product.flowerTypes.map((t) => t.toLowerCase());
      const requiredTypes = filter.flowerTypes.map((t) => t.toLowerCase());
      const hasAnyType = requiredTypes.some((type) =>
        productFlowerTypes.includes(type),
      );
      if (!hasAnyType) return false;
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

export function sortProducts(
  products: Product[],
  sort: SortOption = "priceAsc",
): Product[] {
  const ratingValue = (product: Product) => product.rating?.value ?? 0;

  return [...products].sort((a, b) => {
    switch (sort) {
      case "priceAsc":
        return a.price - b.price || ratingValue(b) - ratingValue(a);
      case "priceDesc":
        return b.price - a.price || ratingValue(b) - ratingValue(a);
      case "ratingDesc":
        return ratingValue(b) - ratingValue(a) || a.price - b.price;
      default:
        return a.price - b.price;
    }
  });
}
