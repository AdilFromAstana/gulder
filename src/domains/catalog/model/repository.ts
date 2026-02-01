import type { Product, Shop } from "./types";
import { SHOPS } from "./data.shops";
import { PRODUCTS } from "./data.products";

export async function getAllShops(): Promise<Shop[]> {
  return SHOPS;
}

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  return SHOPS.find((shop) => shop.slug === slug) ?? null;
}

export async function getShopById(id: string): Promise<Shop | null> {
  return SHOPS.find((shop) => shop.id === id) ?? null;
}

export async function getAllProducts(): Promise<Product[]> {
  return PRODUCTS;
}

export async function getProductsByShopId(shopId: string): Promise<Product[]> {
  return PRODUCTS.filter((product) => product.shopId === shopId);
}

export async function getProductsByShopSlug(
  shopSlug: string,
): Promise<Product[]> {
  const shop = SHOPS.find((s) => s.slug === shopSlug);
  if (!shop) return [];

  return getProductsByShopId(shop.id);
}

export async function getProductByShopAndSlug(
  shopSlug: string,
  productSlug: string,
): Promise<Product | null> {
  const shop = SHOPS.find((s) => s.slug === shopSlug);
  if (!shop) return null;

  const product = PRODUCTS.find(
    (p) => p.shopId === shop.id && p.slug === productSlug,
  );

  return product ?? null;
}
