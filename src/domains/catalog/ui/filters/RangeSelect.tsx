"use client";

type Option = {
  value: string;
  label: string;
};

type RangeSelectProps = {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
  options: Option[];
};

export function RangeSelect({ id, name, label, defaultValue, options }: RangeSelectProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-500" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        name={name}
        defaultValue={defaultValue}
        className="h-9 rounded-md border border-zinc-200 bg-white px-2 text-sm outline-none focus:border-zinc-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
