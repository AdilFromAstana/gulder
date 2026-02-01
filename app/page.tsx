import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-4 px-4 py-8">
      <section className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Каталог букетов в цветочных магазинах Алматы
        </h1>
        <p className="text-sm text-zinc-600">
          Найдите идеальный букет по цене, цвету, составу и наличию подарка.
          Используйте общий каталог или поищите внутри конкретного магазина.
        </p>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Перейти в каталог
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50"
          >
            Поиск по всем букетам
          </Link>
        </div>
      </section>
    </main>
  );
}
