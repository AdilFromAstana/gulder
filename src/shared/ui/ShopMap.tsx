import type { Shop } from "@/src/domains/catalog/model/types";

type ShopMapProps = {
  shop: Shop;
};

// Простая статическая карта через iframe. Не использует client-side JS и не ломает SSR.
export function ShopMap({ shop }: ShopMapProps) {
  const { lat, lng } = shop.location;
  const zoom = 14;

  const src = `https://yandex.com/map-widget/v1/?ll=${lng}%2C${lat}&z=${zoom}`;

  return (
    <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-zinc-900">Магазин на карте</h2>
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-zinc-100">
        <iframe
          src={src}
          title={`Карта магазина ${shop.name}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </section>
  );
}

