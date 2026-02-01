import Link from "next/link";

import type { Product, Shop } from "@/src/domains/catalog/model/types";
import { COLOR_OPTIONS } from "@/src/domains/catalog/model/reference";

type ProductCardProps = {
  product: Product;
  shop: Shop;
};

export function ProductCard({ product, shop }: ProductCardProps) {
  const productUrl = `/shops/${shop.slug}/products/${product.slug}`;

  const hasDiscount = product.hasDiscount && product.oldPrice && product.discountPercent;

  const savingAmount = hasDiscount && product.oldPrice ? product.oldPrice - product.price : null;
  const discountLabel = savingAmount
    ? `-${savingAmount.toLocaleString("ru-RU")} тг`
    : hasDiscount
      ? `-${product.discountPercent}%`
      : null;
  const showGiftTrigger = !hasDiscount && product.gifts && product.gifts.length > 0;

  const colorLabels = product.colors
    .map((c) => COLOR_OPTIONS.find((o) => o.value === c)?.label ?? c)
    .join(", ");

  return (
    <Link href={productUrl} className="block">
      <article className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-3">
        <div className="relative w-full overflow-hidden rounded bg-zinc-100">
          <div className="aspect-square" />
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-[11px] text-zinc-400"
              aria-hidden
            >
              Фото
            </div>
          )}
          {hasDiscount && discountLabel && (
            <span className="absolute left-2 top-2 rounded bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
              {discountLabel}
            </span>
          )}
          {!hasDiscount && showGiftTrigger && (
            <span className="absolute left-2 top-2 rounded bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
              🎁 Подарок
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-1">
          <p className="line-clamp-1 text-sm font-semibold text-zinc-900">{product.title}</p>
          <p className="text-[11px] font-medium text-zinc-500">{shop.name}</p>

          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-zinc-900">
              {product.price.toLocaleString("ru-RU")}
              <span className="pl-1 text-sm font-semibold text-zinc-700">тг</span>
            </span>
            {hasDiscount && product.oldPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {product.oldPrice.toLocaleString("ru-RU")} тг
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600">
            <span>{product.flowersCount} шт.</span>
            {product.colors.length > 0 && <span className="hidden md:inline">• {colorLabels}</span>}
            {!product.isAvailable && <span className="text-red-600">• Нет в наличии</span>}
          </div>
        </div>
      </article>
    </Link>
  );
}
