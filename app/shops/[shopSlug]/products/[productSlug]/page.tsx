import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getProductByShopAndSlug,
  getShopBySlug,
} from "@/src/domains/catalog/model/repository";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";

type PageParams = {
  shopSlug: string;
  productSlug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

async function getData(paramsPromise: Promise<PageParams>) {
  const params = await paramsPromise;

  const [shop, product] = await Promise.all([
    getShopBySlug(params.shopSlug),
    getProductByShopAndSlug(params.shopSlug, params.productSlug),
  ]);

  return { shop, product };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shop, product } = await getData(params);

  if (!shop || !product) {
    return {
      title: "Товар не найден",
    };
  }

  return {
    title: `${product.title} — ${shop.name}`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { shop, product } = await getData(params);

  if (!shop || !product) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-8">
      <Breadcrumbs
        items={[
          { label: "Каталог", href: "/products" },
          { label: shop.name, href: `/shops/${shop.slug}` },
          { label: product.title },
        ]}
      />

      <article className="grid gap-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div>
          <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-zinc-100" aria-hidden="true">
            <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400">
              Фото букета
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-zinc-900">{product.title}</h1>
            <p className="text-sm text-zinc-600">{product.description}</p>
            <p className="text-xs text-zinc-500">
              Магазин: <span className="font-medium">{shop.name}</span>, {shop.city}, {" "}
              {shop.address}
            </p>
          </header>

          <section className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-semibold text-zinc-900">
                {product.price.toLocaleString("ru-RU")} <span className="text-sm font-normal">тг</span>
              </span>
              {product.hasDiscount && product.oldPrice && product.discountPercent && (
                <>
                  <span className="text-sm text-zinc-400 line-through">
                    {product.oldPrice.toLocaleString("ru-RU")} тг
                  </span>
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                    -{product.discountPercent}%
                  </span>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-zinc-600">
              <span className="rounded-full bg-zinc-50 px-2 py-0.5">
                {product.flowersCount} цветков
              </span>
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
          </section>

          <section className="flex flex-col gap-1 text-sm text-zinc-700">
            <h2 className="text-sm font-semibold text-zinc-900">Состав букета</h2>
            <ul className="list-inside list-disc">
              {product.composition.map((item, index) => (
                <li key={`${item.flowerType}-${index}`}>
                  {item.flowerType} — {item.quantity} шт.
                </li>
              ))}
            </ul>
          </section>

          {product.gifts && product.gifts.length > 0 && (
            <section className="flex flex-col gap-1 text-sm text-zinc-700">
              <h2 className="text-sm font-semibold text-zinc-900">Подарки</h2>
              <ul className="list-inside list-disc">
                {product.gifts.map((gift, index) => (
                  <li key={`${gift.type}-${index}`}>
                    {gift.title}
                    {gift.description && ` — ${gift.description}`}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
