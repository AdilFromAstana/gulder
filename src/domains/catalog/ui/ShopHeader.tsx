import type { Shop } from "@/src/domains/catalog/model/types";

type ShopHeaderProps = {
  shop: Shop;
};

export function ShopHeader({ shop }: ShopHeaderProps) {
  return (
    <section className="mb-6 flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">{shop.name}</h1>
        <p className="mt-1 text-sm text-zinc-600">{shop.description}</p>
      </div>

      <div className="grid gap-4 text-sm text-zinc-600 sm:grid-cols-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Адрес
          </span>
          <span>
            {shop.city}, {shop.address}
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Время работы
          </span>
          <span>{shop.workingHours}</span>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Контакты
          </span>
          <span>Телефон: {shop.contacts.phone}</span>
          {shop.contacts.whatsapp && (
            <span>WhatsApp: {shop.contacts.whatsapp}</span>
          )}
          {shop.contacts.instagram && (
            <span>Instagram: @{shop.contacts.instagram}</span>
          )}
        </div>
      </div>
    </section>
  );
}

