export type Shop = {
  id: string;
  slug: string;
  name: string;
  description: string;
  city: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  workingHours: string;
  contacts: {
    phone: string;
    whatsapp?: string;
    instagram?: string;
  };
};

export type ProductCompositionItem = {
  flowerType: string;
  quantity: number;
};

export type ProductGiftType = "toy" | "cake" | "chocolate" | "card";

export type ProductGift = {
  type: ProductGiftType;
  title: string;
  description?: string;
};

export type Product = {
  id: string;
  slug: string;
  shopId: string;

  title: string;
  description: string;

  price: number;
  oldPrice?: number;
  hasDiscount: boolean;
  discountPercent?: number;

  flowersCount: number;

  composition: ProductCompositionItem[];

  colors: string[];

  /** Возможные высоты стеблей в см. */
  stemHeights: number[];

  /** Виды цветов в букете (для фильтра и поиска). */
  flowerTypes: string[];

  gifts?: ProductGift[];

  images: string[];

  rating?: {
    value: number;
    count: number;
  };

  isAvailable: boolean;
};
