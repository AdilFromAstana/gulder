"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import type { ReferenceOption } from "@/src/domains/catalog/model/reference";

type MultiSelectCheckboxProps = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  options: ReferenceOption[];
  selection: string[];
  onChange: (next: string[]) => void;
  formatLabel?: (value: string) => string;
};

export function MultiSelectCheckbox({
  id,
  name,
  label,
  placeholder,
  options,
  selection,
  onChange,
  formatLabel,
}: MultiSelectCheckboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const visibleTags = useMemo(() => selection.slice(0, 2), [selection]);
  const hiddenCount = Math.max(selection.length - visibleTags.length, 0);

  const toggleValue = (value: string) => {
    onChange(selection.includes(value) ? selection.filter((v) => v !== value) : [...selection, value]);
  };

  const resetSelection = () => onChange([]);

  const getLabel = (value: string) => formatLabel?.(value) ?? options.find((o) => o.value === value)?.label ?? value;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-500" htmlFor={id}>
        {label}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((open) => !open)}
          ref={triggerRef}
          className="flex min-h-9 w-full items-center gap-2 rounded-md border border-zinc-200 bg-white px-2 text-left text-sm outline-none transition focus:border-zinc-400"
        >
          {selection.length === 0 ? (
            <span className="text-zinc-400">{placeholder}</span>
          ) : (
            <span className="flex flex-wrap gap-1">
              {visibleTags.map((value) => (
                <span
                  key={value}
                  className="inline-flex items-center gap-1 rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-700"
                >
                  {getLabel(value)}
                  <button
                    type="button"
                    aria-label={`Убрать ${getLabel(value)}`}
                    className="text-zinc-400 hover:text-zinc-600"
                    onClick={(event) => {
                      event.stopPropagation();
                      toggleValue(value);
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
              {hiddenCount > 0 && (
                <span className="inline-flex items-center rounded bg-zinc-100 px-2 py-0.5 text-[11px] text-zinc-600">
                  +{hiddenCount}
                </span>
              )}
            </span>
          )}
          <span className="ml-auto text-xs text-zinc-400">▼</span>
        </button>

        {selection.map((value) => (
          <input key={value} type="hidden" name={name} value={value} />
        ))}

        {isOpen && (
          <div className="absolute left-0 top-full z-[80] mt-1 max-h-[18rem] w-full overflow-hidden rounded-md border border-zinc-200 bg-white shadow-lg">
            <div className="flex items-center justify-between px-3 py-2 text-xs text-zinc-500">
              <span>Выбор</span>
              <button
                type="button"
                className="text-zinc-500 hover:text-zinc-700"
                onClick={resetSelection}
              >
                Сбросить
              </button>
            </div>

            <ul role="listbox" className="max-h-64 overflow-y-auto py-1">
              {options.map((option) => {
                const checked = selection.includes(option.value);
                return (
                  <li key={option.value}>
                    <label className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-zinc-50">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        checked={checked}
                        onChange={() => toggleValue(option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
