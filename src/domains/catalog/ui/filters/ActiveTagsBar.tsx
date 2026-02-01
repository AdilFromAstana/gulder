"use client";

type Tag = {
  label: string;
  value: string;
};

type ActiveTagsBarProps = {
  tags: Tag[];
};

export function ActiveTagsBar({ tags }: ActiveTagsBarProps) {
  if (!tags.length) return null;

  return (
    <div className="no-scrollbar -mb-1 flex h-9 items-center gap-1.5 overflow-x-auto pb-2 pt-1 md:mb-0 md:pt-0">
      {tags.map((tag) => (
        <span
          key={tag.value}
          className="inline-flex h-7 items-center gap-1 rounded-full bg-zinc-100 px-3 text-[11px] font-medium text-zinc-700 shadow-sm"
        >
          {tag.label}
        </span>
      ))}
    </div>
  );
}
