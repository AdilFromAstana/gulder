export type ReferenceOption = {
  value: string;
  label: string;
};

// Часто используемые типы цветов/растений для поиска и подсказок.
export const FLOWER_TYPE_OPTIONS: ReferenceOption[] = [
  { value: "роза", label: "Розы" },
  { value: "роза кустовая", label: "Роза кустовая" },
  { value: "роза спрей", label: "Роза спрей" },
  { value: "хризантема", label: "Хризантемы" },
  { value: "хризантема кустовая", label: "Хризантема кустовая" },
  { value: "лилия", label: "Лилии" },
  { value: "гвоздика", label: "Гвоздики" },
  { value: "тюльпан", label: "Тюльпаны" },
  { value: "тюльпан грейга", label: "Тюльпан Greigii" },
  { value: "тюльпан кауфмана", label: "Тюльпан Kaufmanniana" },
  { value: "тюльпа kolpakowskiana", label: "Tulipa kolpakowskiana" },
  { value: "гипсофила", label: "Гипсофила" },
  { value: "ирис", label: "Ирисы" },
  { value: "гортензия", label: "Гортензия" },
  { value: "орхидея", label: "Орхидеи" },
  { value: "альстромерия", label: "Альстромерии" },
  { value: "эустома", label: "Эустома (лизиантус)" },
  { value: "гербера", label: "Герберы" },
  { value: "ромашка", label: "Ромашки" },
  { value: "лаванда", label: "Лаванда" },
];

// Набор цветов для фильтрации по палитре.
export const COLOR_OPTIONS: ReferenceOption[] = [
  { value: "white", label: "Белый" },
  { value: "black", label: "Чёрный" },
  { value: "red", label: "Красный" },
  { value: "pink", label: "Розовый" },
  { value: "yellow", label: "Жёлтый" },
  { value: "orange", label: "Оранжевый" },
  { value: "peach", label: "Персиковый" },
  { value: "cream", label: "Кремовый" },
  { value: "purple", label: "Фиолетовый" },
  { value: "lilac", label: "Лиловый" },
  { value: "blue", label: "Синий" },
  { value: "light-blue", label: "Голубой" },
  { value: "green", label: "Зелёный" },
  { value: "mint", label: "Мятный" },
  { value: "burgundy", label: "Бордовый" },
  { value: "coral", label: "Коралловый" },
  { value: "champagne", label: "Шампань" },
  { value: "salmon", label: "Лососёвый" },
  { value: "lavender", label: "Лавандовый" },
  { value: "multicolor", label: "Микс / разноцветный" },
];

