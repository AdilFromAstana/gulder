import Link from "next/link";

import type { Product, Shop } from "@/src/domains/catalog/model/types";

type ProductCardProps = {
  product: Product;
  shop: Shop;
};

export function ProductCard({ product, shop }: ProductCardProps) {
  const productUrl = `/shops/${shop.slug}/products/${product.slug}`;

  const hasDiscount = product.hasDiscount && product.oldPrice && product.discountPercent;

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <Link href={productUrl} className="block">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-zinc-100" aria-hidden="true">
          {/* Заглушка вместо изображения, пока нет реальных картинок */}
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
            Фото букета
          </div>
        </div>
      </Link>

      <div className="flex flex-col gap-1">
        <Link href={productUrl} className="text-base font-semibold text-zinc-900 hover:underline">
          {product.title}
        </Link>
        <Link
          href={`/shops/${shop.slug}`}
          className="text-xs font-medium text-zinc-500 hover:underline"
        >
          {shop.name}
        </Link>
      </div>

      <p className="line-clamp-3 text-sm text-zinc-600">{product.description}</p>

      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-semibold text-zinc-900">
          {product.price.toLocaleString("ru-RU")} 
          <span className="text-sm font-normal text-zinc-600">тг</span>
        </span>
        {hasDiscount && (
          <>
            <span className="text-xs text-zinc-400 line-through">
              {product.oldPrice!.toLocaleString("ru-RU")} тг
            </span>
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
              -{product.discountPercent}%
            </span>
          </>
        )}
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-zinc-600">
        <span>{product.flowersCount} цветков</span>
        {product.colors.length > 0 && (
          <span className="rounded-full bg-zinc-50 px-2 py-0.5">
            Цвета: {product.colors.join(", ")}
          </span>
        )}
        {product.gifts && product.gifts.length > 0 && (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
            Есть подарок
          </span>
        )}
        {!product.isAvailable && (
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-zinc-500">
            Нет в наличии
          </span>
        )}
      </div>
    </article>
  );
}
