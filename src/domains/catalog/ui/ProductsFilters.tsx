"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { Shop } from "@/src/domains/catalog/model/types";
import type { RawSearchParams } from "@/src/domains/catalog/model/filtering";
import {
  COLOR_OPTIONS,
  FLOWER_TYPE_OPTIONS,
  STEM_HEIGHT_OPTIONS,
} from "@/src/domains/catalog/model/reference";
import { ActiveTagsBar } from "@/src/domains/catalog/ui/filters/ActiveTagsBar";
import { LabeledNumberInput } from "@/src/domains/catalog/ui/filters/LabeledNumberInput";
import { LabeledSelect } from "@/src/domains/catalog/ui/filters/LabeledSelect";
import { MultiSelectCheckbox } from "@/src/domains/catalog/ui/filters/MultiSelectCheckbox";
import type { SortOption } from "@/src/domains/catalog/model/filtering";

type ProductsFiltersProps = {
  searchParams: RawSearchParams;
  shops?: Shop[];
  showShopSelect?: boolean;
};

const FLOWERS_RANGE_OPTIONS = [
  { value: "", label: "Любое" },
  { value: "lt11", label: "до 11 шт" },
  { value: "11-31", label: "от 11 до 31 шт" },
  { value: "31-61", label: "от 31 до 61 шт" },
  { value: "61-91", label: "от 61 до 91 шт" },
  { value: "gt91", label: "более 91 шт" },
];

const BOOLEAN_SELECT_OPTIONS = [
  { value: "", label: "Не важно" },
  { value: "true", label: "Да" },
  { value: "false", label: "Нет" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "priceAsc", label: "Сначала дешевые" },
  { value: "priceDesc", label: "Сначала дорогие" },
  { value: "ratingDesc", label: "По рейтингу" },
];

export function ProductsFilters({ searchParams, shops, showShopSelect }: ProductsFiltersProps) {
  const priceFrom = (searchParams.priceFrom as string | undefined) ?? "";
  const priceTo = (searchParams.priceTo as string | undefined) ?? "";
  const flowersCountRange = (searchParams.flowersCountRange as string | undefined) ?? "";
  const hasDiscount = (searchParams.hasDiscount as string | undefined) ?? "";
  const hasGift = (searchParams.hasGift as string | undefined) ?? "";
  const shopSlug = (searchParams.shopSlug as string | undefined) ?? "";
  const sort = (searchParams.sort as string | undefined) ?? "priceAsc";

  const [colorSelection, setColorSelection] = useState<string[]>(normalizeArray(searchParams.colors));
  const [flowerTypeSelection, setFlowerTypeSelection] = useState<string[]>(
    normalizeArray(searchParams.flowerTypes),
  );
  const [stemHeightsSelection, setStemHeightsSelection] = useState<string[]>(
    normalizeArray(searchParams.stemHeights),
  );

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const previousBodyOverflowRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isSheetOpen) {
      previousBodyOverflowRef.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    } else if (previousBodyOverflowRef.current !== null) {
      document.body.style.overflow = previousBodyOverflowRef.current;
      previousBodyOverflowRef.current = null;
    }

    return () => {
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
        previousBodyOverflowRef.current = null;
      }
    };
  }, [isSheetOpen]);

  const activeTags = useMemo(() => {
    const tags: { label: string; value: string }[] = [];

    if (priceFrom) tags.push({ label: `от ${priceFrom}₸`, value: "priceFrom" });
    if (priceTo) tags.push({ label: `до ${priceTo}₸`, value: "priceTo" });
    if (flowersCountRange)
      tags.push({ label: "кол-во цветов", value: `flowersCountRange:${flowersCountRange}` });
    if (hasDiscount) tags.push({ label: "со скидкой", value: `hasDiscount:${hasDiscount}` });
    if (hasGift) tags.push({ label: "с подарком", value: `hasGift:${hasGift}` });
    if (shopSlug) tags.push({ label: "магазин", value: `shop:${shopSlug}` });

    pushTags(tags, colorSelection, COLOR_OPTIONS, "color");
    pushTags(tags, flowerTypeSelection, FLOWER_TYPE_OPTIONS, "flower");
    pushTags(tags, stemHeightsSelection, STEM_HEIGHT_OPTIONS, "height", (value) => `${value} см`);

    return tags;
  }, [
    priceFrom,
    priceTo,
    flowersCountRange,
    hasDiscount,
    hasGift,
    shopSlug,
    sort,
    colorSelection,
    flowerTypeSelection,
    stemHeightsSelection,
  ]);

  const handleResetAll = () => {
    formRef.current?.reset();
    setColorSelection([]);
    setFlowerTypeSelection([]);
    setStemHeightsSelection([]);
  };

  const formClassName = [
    "flex flex-col gap-4 bg-white",
    `${isSheetOpen ? "flex" : "hidden"} md:flex`,
    "fixed inset-0 z-[60] overflow-y-auto md:overflow-visible rounded-t-2xl border border-zinc-100 p-4 shadow-[0_-16px_40px_-16px_rgba(0,0,0,0.28)] transition-transform duration-200 ease-out",
    isSheetOpen
      ? "pointer-events-auto opacity-100 translate-y-0"
      : "pointer-events-none opacity-0 translate-y-full",
    "md:static md:inset-auto md:z-[20] md:max-h-none md:translate-y-0 md:opacity-100 md:pointer-events-auto md:rounded-lg md:shadow-sm md:border md:border-zinc-200 md:p-4 md:mb-6",
  ].join(" ");

  return (
    <>
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-zinc-900 px-3 text-xs font-medium text-white shadow hover:bg-zinc-800"
          onClick={() => setIsSheetOpen(true)}
        >
          <span className="text-sm">☰</span>
          <span>Фильтры</span>
        </button>
        <ActiveTagsBar tags={activeTags} />
      </div>

      <div
        className={`fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] transition-opacity duration-200 ease-out md:hidden ${isSheetOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsSheetOpen(false)}
        aria-hidden={!isSheetOpen}
      />

      <form ref={formRef} method="get" className={formClassName} aria-hidden={!isSheetOpen && undefined}>
        <div className="flex items-center justify-between md:hidden">
          <span className="text-sm font-semibold text-zinc-900">Фильтры</span>
          <button
            type="button"
            aria-label="Закрыть фильтры"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-base text-zinc-500"
            onClick={() => setIsSheetOpen(false)}
          >
            ×
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <LabeledNumberInput
            id="priceFrom"
            name="priceFrom"
            label="Цена от, тг"
            defaultValue={priceFrom}
          />
          <LabeledNumberInput
            id="priceTo"
            name="priceTo"
            label="Цена до, тг"
            defaultValue={priceTo}
          />
          <LabeledSelect
            id="flowersCountRange"
            name="flowersCountRange"
            label="Количество цветов, шт"
            defaultValue={flowersCountRange}
            options={FLOWERS_RANGE_OPTIONS}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <LabeledSelect
            id="hasDiscount"
            name="hasDiscount"
            label="Скидка"
            defaultValue={hasDiscount}
            options={BOOLEAN_SELECT_OPTIONS}
          />
          <LabeledSelect
            id="hasGift"
            name="hasGift"
            label="Подарок"
            defaultValue={hasGift}
            options={BOOLEAN_SELECT_OPTIONS}
          />
          <MultiSelectCheckbox
            id="colors"
            name="colors"
            label="Цвета"
            placeholder="Любой цвет"
            options={COLOR_OPTIONS}
            selection={colorSelection}
            onChange={setColorSelection}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <MultiSelectCheckbox
            id="flowerTypes"
            name="flowerTypes"
            label="Виды цветов"
            placeholder="Любой вид"
            options={FLOWER_TYPE_OPTIONS}
            selection={flowerTypeSelection}
            onChange={setFlowerTypeSelection}
          />
          <MultiSelectCheckbox
            id="stemHeights"
            name="stemHeights"
            label="Высота цветка, см"
            placeholder="Любая высота"
            options={STEM_HEIGHT_OPTIONS}
            selection={stemHeightsSelection}
            onChange={setStemHeightsSelection}
            formatLabel={(value) =>
              STEM_HEIGHT_OPTIONS.find((option) => option.value === value)?.label ?? `${value} см`
            }
          />
          <LabeledSelect
            id="sort"
            name="sort"
            label="Сортировка"
            defaultValue={sort}
            options={SORT_OPTIONS}
          />
        </div>

        {showShopSelect && shops?.length ? (
          <div className="grid gap-4 sm:grid-cols-3">
            <LabeledSelect
              id="shopSlug"
              name="shopSlug"
              label="Магазин"
              defaultValue={shopSlug}
              options={[{ value: "", label: "Все магазины" }, ...(shops ?? []).map((shop) => ({
                value: shop.slug,
                label: shop.name,
              }))]}
            />
          </div>
        ) : null}

        <div className="flex flex-wrap items-center gap-2 border-t border-zinc-100 pt-3 md:border-0 md:pt-0">
          <button
            type="button"
            onClick={handleResetAll}
            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900"
          >
            Сбросить
          </button>
          <button
            type="submit"
            className="inline-flex h-9 items-center justify-center rounded-md bg-zinc-900 px-4 text-sm font-medium text-white transition hover:bg-zinc-800"
            onClick={() => setIsSheetOpen(false)}
          >
            Применить фильтры
          </button>
        </div>
      </form>
    </>
  );
}

function normalizeArray(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function pushTags(
  tags: { label: string; value: string }[],
  selection: string[],
  options: { value: string; label: string }[],
  prefix: string,
  fallbackLabel?: (value: string) => string,
) {
  selection.forEach((value) => {
    const label = options.find((o) => o.value === value)?.label ?? fallbackLabel?.(value) ?? value;
    tags.push({ label, value: `${prefix}:${value}` });
  });
}
