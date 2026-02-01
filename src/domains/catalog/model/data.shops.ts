import type { Shop } from "./types";

export const SHOPS: Shop[] = [
  {
    id: "rose-house",
    slug: "rose-house",
    name: "Rose House",
    description:
      "Студия авторских букетов с акцентом на классические розы и минималистичную упаковку.",
    city: "Алматы",
    address: "ул. Абая, 25",
    location: {
      lat: 43.238949,
      lng: 76.889709,
    },
    workingHours: "Ежедневно с 9:00 до 21:00",
    contacts: {
      phone: "+7 700 123 45 67",
      whatsapp: "+7 700 123 45 67",
      instagram: "rose.house.almaty",
    },
  },
  {
    id: "tulip-garden",
    slug: "tulip-garden",
    name: "Tulip Garden",
    description:
      "Магазин сезонных тюльпанов и ярких весенних композиций с доставкой по городу.",
    city: "Алматы",
    address: "пр. Достык, 120",
    location: {
      lat: 43.230247,
      lng: 76.951023,
    },
    workingHours: "Пн–Пт с 8:00 до 20:00, Сб–Вс с 9:00 до 19:00",
    contacts: {
      phone: "+7 701 555 66 77",
      whatsapp: "+7 701 555 66 77",
      instagram: "tulip.garden.almaty",
    },
  },
  {
    id: "orchid-studio",
    slug: "orchid-studio",
    name: "Orchid Studio",
    description:
      "Бутик орхидей и премиальных композиций для особых случаев и корпоративных клиентов.",
    city: "Алматы",
    address: "ул. Назарбаева, 55",
    location: {
      lat: 43.247314,
      lng: 76.935753,
    },
    workingHours: "Ежедневно с 10:00 до 22:00",
    contacts: {
      phone: "+7 702 888 99 00",
      instagram: "orchid.studio.kz",
    },
  },
];
