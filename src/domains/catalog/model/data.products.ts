import type { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "rose-classic-51",
    slug: "classic-51-red-roses",
    shopId: "rose-house",
    title: "Классический букет из 51 красной розы",
    description:
      "Плотный круглый букет из 51 красной розы с длинным стеблем, перевязанный атласной лентой.",
    price: 45000,
    oldPrice: 52000,
    hasDiscount: true,
    discountPercent: 13,
    flowersCount: 51,
    composition: [
      {
        flowerType: "красная роза",
        quantity: 51,
      },
    ],
    colors: ["red"],
    gifts: [
      {
        type: "card",
        title: "Открытка с индивидуальным пожеланием",
        description: "Мы напечатаем ваш текст на дизайнерской открытке.",
      },
    ],
    images: ["/file.svg"],
    isAvailable: true,
  },
  {
    id: "rose-white-25",
    slug: "white-roses-25",
    shopId: "rose-house",
    title: "25 белых роз в крафтовой бумаге",
    description:
      "Нежный букет из 25 белых роз в крафтовой упаковке — универсальный вариант для любого повода.",
    price: 26000,
    hasDiscount: false,
    flowersCount: 25,
    composition: [
      {
        flowerType: "белая роза",
        quantity: 25,
      },
    ],
    colors: ["white"],
    gifts: undefined,
    images: ["/globe.svg"],
    isAvailable: true,
  },
  {
    id: "tulip-mix-31",
    slug: "spring-tulip-mix-31",
    shopId: "tulip-garden",
    title: "Весенний микс из 31 тюльпана",
    description:
      "Яркий букет из разноцветных тюльпанов: розовых, жёлтых, белых и фиолетовых.",
    price: 18000,
    hasDiscount: true,
    oldPrice: 21000,
    discountPercent: 14,
    flowersCount: 31,
    composition: [
      { flowerType: "розовый тюльпан", quantity: 8 },
      { flowerType: "жёлтый тюльпан", quantity: 8 },
      { flowerType: "белый тюльпан", quantity: 7 },
      { flowerType: "фиолетовый тюльпан", quantity: 8 },
    ],
    colors: ["pink", "yellow", "white", "purple"],
    gifts: [
      {
        type: "chocolate",
        title: "Мини-набор конфет",
        description: "Небольшая коробочка бельгийского шоколада.",
      },
    ],
    images: ["/next.svg"],
    isAvailable: true,
  },
  {
    id: "tulip-pastel-15",
    slug: "pastel-tulips-15",
    shopId: "tulip-garden",
    title: "Пастельные тюльпаны, 15 шт.",
    description:
      "Компактный букет из пастельных тюльпанов — нежное дополнение к поздравлению.",
    price: 11000,
    hasDiscount: false,
    flowersCount: 15,
    composition: [
      { flowerType: "кремовый тюльпан", quantity: 7 },
      { flowerType: "розовый тюльпан", quantity: 8 },
    ],
    colors: ["pink", "cream"],
    gifts: [
      {
        type: "card",
        title: "Мини-открытка",
      },
    ],
    images: ["/window.svg"],
    isAvailable: true,
  },
  {
    id: "orchid-phalaenopsis-3",
    slug: "phalaenopsis-3-branches",
    shopId: "orchid-studio",
    title: "Фаленопсис в кашпо, 3 ветви",
    description:
      "Премиальный фаленопсис в керамическом кашпо с декоративным мхом.",
    price: 60000,
    hasDiscount: false,
    flowersCount: 15,
    composition: [
      { flowerType: "орхидея фаленопсис", quantity: 3 },
      { flowerType: "декоративная зелень", quantity: 5 },
      { flowerType: "мох", quantity: 7 },
    ],
    colors: ["white"],
    gifts: [
      {
        type: "card",
        title: "Подарочная открытка Orchid Studio",
      },
    ],
    images: ["/vercel.svg"],
    isAvailable: true,
  },
  {
    id: "orchid-box-toy",
    slug: "orchid-box-with-toy",
    shopId: "orchid-studio",
    title: "Цветочная коробка с орхидеями и игрушкой",
    description:
      "Коробка с орхидеями и сезонными цветами, дополненная мягкой игрушкой — готовый подарок.",
    price: 38000,
    oldPrice: 42000,
    hasDiscount: true,
    discountPercent: 10,
    flowersCount: 21,
    composition: [
      { flowerType: "орхидея", quantity: 5 },
      { flowerType: "роза", quantity: 8 },
      { flowerType: "эустома", quantity: 8 },
    ],
    colors: ["white", "pink", "green"],
    gifts: [
      {
        type: "toy",
        title: "Плюшевый мишка",
      },
      {
        type: "card",
        title: "Подарочная открытка",
      },
    ],
    images: ["/file.svg"],
    isAvailable: false,
  },
];
