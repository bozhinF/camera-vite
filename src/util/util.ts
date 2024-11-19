import { Entries, FitlerOptions, Products, Reviews } from '../types/types';

export const capitalize = (string: string): string =>
  string[0].toUpperCase() + string.slice(1);

export const sortReviewsByDate = (reviews: Reviews) => {
  const result = [...reviews].sort((reviewA, reviewB) => {
    const reviewADate = Date.parse(reviewA.createAt);
    const reviewBDate = Date.parse(reviewB.createAt);
    return reviewBDate - reviewADate;
  });

  return result;
};

export const getTitleByValue = (
  filterOptions: FitlerOptions,
  key: keyof FitlerOptions,
  value: string | string[]
): string | string[] | null => {
  if (typeof value === 'string') {
    const title = filterOptions[key].find(
      (filterOption) => filterOption.value === value
    )?.title;
    return title || null;
  }
  const titles = value
    .map(
      (item) =>
        filterOptions[key].find((filterOption) => filterOption.value === item)
          ?.title
    )
    .filter((title) => title !== undefined);
  return titles;
};

export const filter = {
  price: (products: Products, prices: { from: number; to: number }): Products =>
    products.filter(
      (product) => product.price >= prices.from && product.price <= prices.to
    ),
  category: (products: Products, category: string): Products =>
    products.filter((product) => product.category === category),
  type: (products: Products, type: string[]): Products =>
    products.filter((product) => type.includes(product.type)),
  level: (products: Products, level: string[]): Products =>
    products.filter((product) => level.includes(product.level)),
};

export const sort = {
  price: (products: Products, order: 'up' | 'down'): Products => {
    if (order === 'up') {
      return [...products].sort((a, b) => a.price - b.price);
    }
    return [...products].sort((a, b) => b.price - a.price);
  },
  popular: (products: Products, order: 'up' | 'down'): Products => {
    if (order === 'up') {
      return [...products].sort((a, b) => a.rating - b.rating);
    }
    return [...products].sort((a, b) => b.rating - a.rating);
  },
};

export function getObjectValue<T extends object, K extends keyof T>(
  obj: T,
  key: string | null
): T[K] {
  if (key !== null && key in obj) {
    const typedKey = key as K;
    return obj[typedKey];
  }
  return Object.values(obj)[0] as T[K];
}
export function getObjectValues<T extends object, K extends keyof T>(
  obj: T
): T[K][] {
  const keys = Object.keys(obj) as K[];
  return keys.map((key) => obj[key]);
}
export function getObjectKey<T extends object, K extends keyof T>(
  obj: T,
  key: string
) {
  if (key in obj) {
    return key as K;
  }
  return Object.keys(obj)[0] as K;
}

export function getObjectKeys<T extends object, K extends keyof T>(obj: T) {
  return Object.keys(obj) as K[];
}

// export function getEntries<>

export function getTypedObjectKey<
  T extends Record<K, unknown>,
  K extends keyof T
>(obj: T, key: K): K | undefined {
  if (key in obj) {
    return key; // здесь ключ уже имеет литеральный тип
  }
  return undefined;
}

export function getObjectEntries<T extends object>(object: T): Entries<T> {
  return Object.entries(object) as Entries<T>;
}
