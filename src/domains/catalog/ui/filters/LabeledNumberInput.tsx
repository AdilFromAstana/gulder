"use client";

type LabeledNumberInputProps = {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
};

export function LabeledNumberInput({ id, name, label, defaultValue }: LabeledNumberInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-zinc-500" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="number"
        min={0}
        defaultValue={defaultValue}
        className="h-9 rounded-md border border-zinc-200 px-2 text-sm outline-none focus:border-zinc-400"
      />
    </div>
  );
}
