import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllProducts,
  getAllShops,
  getProductByShopAndSlug,
  getShopBySlug,
} from "@/src/domains/catalog/model/repository";
import type { Product, Shop } from "@/src/domains/catalog/model/types";
import { Breadcrumbs } from "@/src/shared/ui/Breadcrumbs";
import { BackButton } from "@/src/shared/ui/BackButton";

type PageParams = {
  shopSlug: string;
  productSlug: string;
};

type PageProps = {
  params: Promise<PageParams>;
};

type RecommendationItem = {
  product: Product;
  shop: Shop;
};

async function getData(paramsPromise: Promise<PageParams>) {
  const params = await paramsPromise;

  const [shop, product] = await Promise.all([
    getShopBySlug(params.shopSlug),
    getProductByShopAndSlug(params.shopSlug, params.productSlug),
  ]);

  return { shop, product };
}

function toMapById(shops: Shop[]) {
  return new Map<string, Shop>(shops.map((s) => [s.id, s]));
}

function mapRecommendationItems(
  products: Product[],
  shopsById: Map<string, Shop>,
  limit = 12,
): RecommendationItem[] {
  return products
    .map((p) => {
      const shop = shopsById.get(p.shopId);
      return shop ? { product: p, shop } : null;
    })
    .filter((item): item is RecommendationItem => Boolean(item))
    .slice(0, limit);
}

function filterByPriceBand(current: Product, candidates: Product[]) {
  const min = current.price * 0.85;
  const max = current.price * 1.15;
  return candidates
    .filter((p) => p.price >= min && p.price <= max)
    .sort((a, b) => Math.abs(a.price - current.price) - Math.abs(b.price - current.price));
}

function filterSameShop(current: Product, candidates: Product[]) {
  return candidates
    .filter((p) => p.shopId === current.shopId)
    .sort((a, b) => a.price - b.price);
}

function filterByFlowersCount(current: Product, candidates: Product[]) {
  return candidates
    .filter((p) => p.flowersCount !== current.flowersCount)
    .sort(
      (a, b) =>
        Math.abs(a.flowersCount - current.flowersCount) -
        Math.abs(b.flowersCount - current.flowersCount),
    );
}

function filterByFlowerTypes(current: Product, candidates: Product[]) {
  return candidates
    .filter((p) => p.flowerTypes.some((type) => current.flowerTypes.includes(type)))
    .sort((a, b) => b.price - a.price);
}

function filterSimilarGeneral(current: Product, candidates: Product[]) {
  return candidates
    .filter(
      (p) =>
        p.colors.some((c) => current.colors.includes(c)) ||
        p.flowerTypes.some((type) => current.flowerTypes.includes(type)) ||
        Math.abs(p.price - current.price) <= current.price * 0.2,
    )
    .sort((a, b) => (b.rating?.value ?? 0) - (a.rating?.value ?? 0));
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

function RecommendationCard({ item }: { item: RecommendationItem }) {
  const { product, shop } = item;

  return (
    <article className="snap-start flex h-full flex-col justify-between rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-zinc-900">
            {product.price.toLocaleString("ru-RU")}
            <span className="pl-1 text-sm font-semibold text-zinc-700">тг</span>
          </span>
          {product.hasDiscount && product.oldPrice && (
            <span className="text-xs text-zinc-400 line-through">
              {product.oldPrice.toLocaleString("ru-RU")} тг
            </span>
          )}
        </div>

        <div className="relative w-full overflow-hidden rounded-md border border-zinc-100 bg-zinc-50">
          <div className="aspect-square" />
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-[11px] text-zinc-400" aria-hidden>
              Фото
            </div>
          )}
        </div>

        <p className="line-clamp-2 text-sm font-semibold text-zinc-900">{product.title}</p>
        <p className="text-[11px] font-medium text-zinc-500">{shop.name}</p>
      </div>

      <div className="mt-2 flex items-center gap-2 text-xs text-zinc-600">
        {product.flowersCount ? <span>{product.flowersCount} шт.</span> : null}
        {!product.isAvailable && <span className="text-red-600">Нет в наличии</span>}
      </div>
    </article>
  );
}

function RecommendationSection({
  title,
  items,
}: {
  title: string;
  items: RecommendationItem[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-zinc-900">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-500">Нет подходящих букетов</p>
      ) : (
        <div
          className="grid grid-flow-col auto-cols-[calc(50%-8px)] md:auto-cols-[calc(33.333%-12px)] gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hidden-mobile"
          role="list"
        >
          {items.map((item) => (
            <div role="listitem" key={item.product.id}>
              <RecommendationCard item={item} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { shop, product } = await getData(params);

  if (!shop || !product) {
    notFound();
  }

  const [allProducts, allShops] = await Promise.all([getAllProducts(), getAllShops()]);
  const shopsById = toMapById(allShops);
  const otherProducts = allProducts.filter((p) => p.id !== product.id);

  const similarByPrice = filterByPriceBand(product, otherProducts);
  const sameShop = filterSameShop(product, otherProducts);
  const moreOrLessFlowers = filterByFlowersCount(product, otherProducts);
  const byFlowerTypes = filterByFlowerTypes(product, otherProducts);
  const similarGeneral = filterSimilarGeneral(product, otherProducts);

  const sections = [
    { title: "Похожие по цене", items: mapRecommendationItems(similarByPrice, shopsById) },
    { title: "Ещё из этого магазина", items: mapRecommendationItems(sameShop, shopsById) },
    { title: "Больше / меньше цветов", items: mapRecommendationItems(moreOrLessFlowers, shopsById) },
    { title: "По типу цветов", items: mapRecommendationItems(byFlowerTypes, shopsById) },
    { title: "Похожие букеты", items: mapRecommendationItems(similarGeneral.length ? similarGeneral : otherProducts, shopsById) },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <BackButton fallbackHref={`/shops/${shop!.slug}`} iconOnly />
        <Breadcrumbs
          items={[
            { label: "Каталог", href: "/products" },
            { label: shop!.name, href: `/shops/${shop!.slug}` },
            { label: product!.title },
          ]}
        />
      </div>

      <article className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="lg:sticky lg:top-6">
          <div className="aspect-square w-full max-h-[70vw] overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 shadow-sm lg:max-h-[520px]">
            {product!.images && product!.images[0] ? (
              <img
                src={product!.images[0]}
                alt={product!.title}
                className="h-full w-full rounded-lg object-cover"
                loading="eager"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-zinc-400" aria-hidden>
                Фото букета
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <header className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-semibold text-zinc-900">{product!.title}</h1>
              <p className="text-sm text-zinc-600">{product!.description}</p>
              <p className="text-xs text-zinc-500">
                Магазин: <span className="font-medium">{shop!.name}</span>, {shop!.city}, {shop!.address}
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-zinc-900">
                  {product!.price.toLocaleString("ru-RU")} <span className="text-lg font-semibold text-zinc-700">тг</span>
                </span>
                {product!.hasDiscount && product!.oldPrice && product!.discountPercent && (
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <span className="line-through">{product!.oldPrice.toLocaleString("ru-RU")} тг</span>
                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                      -{product!.discountPercent}%
                    </span>
                  </div>
                )}
                {!product!.isAvailable && (
                  <span className="mt-2 inline-flex w-fit rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                    Нет в наличии
                  </span>
                )}
              </div>
            </div>
          </header>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-zinc-900">Атрибуты</h2>
            <div className="flex flex-wrap gap-2 text-xs text-zinc-700">
              <span className="rounded-full bg-zinc-50 px-3 py-1">{product!.flowersCount} цветков</span>
              {product!.colors.length > 0 && (
                <span className="rounded-full bg-zinc-50 px-3 py-1">Цвета: {product!.colors.join(", ")}</span>
              )}
              {product!.gifts && product!.gifts.length > 0 && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">Есть подарок</span>
              )}
              {product!.stemHeights.length > 0 && (
                <span className="rounded-full bg-zinc-50 px-3 py-1">Стебель: {product!.stemHeights.join("/")} см</span>
              )}
              {product!.flowerTypes.length > 0 && (
                <span className="rounded-full bg-zinc-50 px-3 py-1">Тип: {product!.flowerTypes.join(", ")}</span>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-zinc-900">Описание</h2>
            <p className="text-sm leading-relaxed text-zinc-700">{product!.description}</p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-sm font-semibold text-zinc-900">Состав</h2>
            <ul className="list-inside list-disc text-sm text-zinc-700">
              {product!.composition.map((item, index) => (
                <li key={`${item.flowerType}-${index}`}>
                  {item.flowerType} — {item.quantity} шт.
                </li>
              ))}
            </ul>
          </section>

          {product!.gifts && product!.gifts.length > 0 && (
            <section className="flex flex-col gap-2">
              <h2 className="text-sm font-semibold text-zinc-900">Подарки</h2>
              <ul className="list-inside list-disc text-sm text-zinc-700">
                {product!.gifts.map((gift, index) => (
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

      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <RecommendationSection key={section.title} title={section.title} items={section.items} />
        ))}
      </div>
    </div>
  );
}
