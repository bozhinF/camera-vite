import {
  Entries,
  FilterOptionsItem,
  FitlerOptions,
  Products,
  Reviews,
  updateURLProps,
} from '../types/types';

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

export function checkIsParamValid<K>(param: string, options: K[]) {
  return options.some((option) => option === param);
}

export function checkParamEqualCurrentValue<T>(param: T, value: T) {
  if (Array.isArray(param) && Array.isArray(value)) {
    return (
      param.every((paramItem) =>
        value.some((valueItem) => valueItem === paramItem)
      ) &&
      value.every((valueItem) =>
        param.some((paramItem) => paramItem === valueItem)
      )
    );
  }
  return param === value;
}

export function assignValue<T extends Record<K, unknown>, K extends keyof T>(
  obj1: T,
  key: K,
  value: T[K]
) {
  obj1[key] = value;
}

type PossibleValues<T> = {
  [K in keyof T]: FilterOptionsItem;
};
export function setFilterStateFromParams<
  T extends Record<K, unknown>,
  K extends keyof T
>(
  currentFilter: T,
  currentOptions: PossibleValues<T>,
  searchParams: URLSearchParams
) {
  const filterKeys = getObjectKeys(currentFilter);
  const invalidParams: updateURLProps = [];
  filterKeys.forEach((key) => {
    const value = currentFilter[key];
    const options = currentOptions[key];

    const param = searchParams.get(String(key));
    if (typeof value === 'number' || value === null) {
      if (param === null) {
        assignValue(currentFilter, key, null as T[K]);
        return;
      }
      if (!isNaN(+param)) {
        assignValue(currentFilter, key, +param as T[K]);
      }
    }

    if (
      typeof value === 'string' &&
      param !== null &&
      typeof currentFilter[key] === 'string'
    ) {
      const optionsValues = options.map((option) => option.value);
      const isParamValid = checkIsParamValid(param, optionsValues);
      const isParamEqualValue = checkParamEqualCurrentValue(param, value);
      if ((isParamValid || param === '') && !isParamEqualValue) {
        const result = optionsValues.find(
          (optionsValue) => optionsValue === param
        );
        if (result) {
          assignValue(currentFilter, key, result as T[keyof T]);
        }
      }
      if (!isParamValid) {
        invalidParams.push({ param: String(key), action: 'delete' });
      }
      return;
    }

    if (Array.isArray(value) && typeof key === 'string') {
      const allParams = searchParams.getAll(key);
      const optionsValues = options.map((option) => option.value);
      const validParams = allParams.filter((item) => {
        const isParamValid = checkIsParamValid(item, optionsValues);
        if (!isParamValid) {
          invalidParams.push({
            param: String(key),
            prop: item,
            action: 'delete',
          });
        }
        return isParamValid;
      });
      const isParamEqualValue = checkParamEqualCurrentValue(validParams, value);
      if (!isParamEqualValue) {
        assignValue(currentFilter, key, validParams as T[keyof T]);
      }
    }
  });
  return invalidParams;
}
