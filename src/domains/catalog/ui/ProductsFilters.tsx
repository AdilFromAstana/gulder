import type { Shop } from "@/src/domains/catalog/model/types";
import type { RawSearchParams } from "@/src/domains/catalog/model/filtering";
import { COLOR_OPTIONS } from "@/src/domains/catalog/model/reference";

type ProductsFiltersProps = {
  /** Текущие searchParams для заполнения значений по умолчанию. */
  searchParams: RawSearchParams;
  /** Список магазинов для фильтрации в общем каталоге. */
  shops?: Shop[];
  /** Показывать ли селект магазина. */
  showShopSelect?: boolean;
};

export function ProductsFilters({
  searchParams,
  shops,
  showShopSelect,
}: ProductsFiltersProps) {
  const priceFrom = (searchParams.priceFrom as string | undefined) ?? "";
  const priceTo = (searchParams.priceTo as string | undefined) ?? "";
  const flowersCountFrom =
    (searchParams.flowersCountFrom as string | undefined) ?? "";
  const hasDiscount = (searchParams.hasDiscount as string | undefined) ?? "";
  const hasGift = (searchParams.hasGift as string | undefined) ?? "";
  const colorsRaw = searchParams.colors;
  const shopSlug = (searchParams.shopSlug as string | undefined) ?? "";

  const selectedColors: string[] = Array.isArray(colorsRaw)
    ? colorsRaw
    : colorsRaw
    ? colorsRaw
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    : [];

  return (
    <form
      method="get"
      className="mb-6 flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="priceFrom">
            Цена от, тг
          </label>
          <input
            id="priceFrom"
            name="priceFrom"
            type="number"
            min={0}
            defaultValue={priceFrom}
            className="h-9 rounded-md border border-zinc-200 px-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="priceTo">
            Цена до, тг
          </label>
          <input
            id="priceTo"
            name="priceTo"
            type="number"
            min={0}
            defaultValue={priceTo}
            className="h-9 rounded-md border border-zinc-200 px-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label
            className="text-xs font-medium text-zinc-500"
            htmlFor="flowersCountFrom"
          >
            Кол-во цветов от
          </label>
          <input
            id="flowersCountFrom"
            name="flowersCountFrom"
            type="number"
            min={1}
            defaultValue={flowersCountFrom}
            className="h-9 rounded-md border border-zinc-200 px-2 text-sm outline-none focus:border-zinc-400"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="hasDiscount">
            Скидка
          </label>
          <select
            id="hasDiscount"
            name="hasDiscount"
            defaultValue={hasDiscount}
            className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm outline-none focus:border-zinc-400"
          >
            <option value="">Не важно</option>
            <option value="true">Только со скидкой</option>
            <option value="false">Без скидки</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="hasGift">
            Подарок
          </label>
          <select
            id="hasGift"
            name="hasGift"
            defaultValue={hasGift}
            className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm outline-none focus:border-zinc-400"
          >
            <option value="">Не важно</option>
            <option value="true">Только с подарком</option>
            <option value="false">Без подарка</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-zinc-500" htmlFor="colors">
            Цвета
          </label>
          <select
            id="colors"
            name="colors"
            multiple
            defaultValue={selectedColors}
            className="min-h-9 rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm outline-none focus:border-zinc-400"
          >
            {COLOR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-zinc-400">
            Зажмите Ctrl (Cmd на Mac), чтобы выбрать несколько цветов.
          </p>
        </div>
      </div>

      {showShopSelect && shops && shops.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-zinc-500" htmlFor="shopSlug">
              Магазин
            </label>
            <select
              id="shopSlug"
              name="shopSlug"
              defaultValue={shopSlug}
              className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm outline-none focus:border-zinc-400"
            >
              <option value="">Все магазины</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.slug}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Применить фильтры
        </button>
      </div>
    </form>
  );
}
