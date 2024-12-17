import { FilterState } from '../store/filter-slice/filter-slice';
import {
  Entries,
  FitlerOptions,
  PossibleFilterItemValues,
  Product,
  Products,
  Review,
  Reviews,
  updateURLProps,
} from '../types/types';
import { commerce, datatype, helpers, image, lorem, name } from 'faker';

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

export const getObjectKeys = <T extends object, K extends keyof T>(obj: T) =>
  Object.keys(obj) as K[];

export const getObjectEntries = <T extends object>(object: T): Entries<T> =>
  Object.entries(object) as Entries<T>;

export const checkIsParamValid = <K>(param: string, options: K[]) =>
  options.some((option) => option === param);

export const checkParamEqualCurrentValue = <T>(param: T, value: T) => {
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
};

export const assignValue = <T extends Record<K, unknown>, K extends keyof T>(
  obj1: T,
  key: K,
  value: T[K]
) => {
  obj1[key] = value;
};

export const setFilterStateFromParams = <
  T extends Record<K, unknown>,
  K extends keyof T
>(currentFilter: T, currentOptions: PossibleFilterItemValues<T>, searchParams: URLSearchParams) => {
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
};

export const getSelectedFilterOptions = (filterState: FilterState): string[] =>
  Object.entries(filterState).reduce((options: string[], [key, value]) => {
    if (value === null) {
      return options;
    }
    if (Array.isArray(value) && !value.length) {
      return options;
    }
    if (!(key in filter)) {
      return options;
    }
    return [...options, key];
  }, []);

export const discountIncreaser = (count: number, discount = 0) => {
  if (count === 1) {
    return discount;
  }
  if (count === 2) {
    const result = discount + 3;
    return result;
  }
  if (count >= 3 && count <= 5) {
    const result = discount + 5;
    return result;
  }
  if (count >= 6 && count <= 10) {
    const result = discount + 10;
    return result;
  }
  const result = discount + 15;
  return result;
};

export const discountDecreaser = (price: number, discount = 0) => {
  if (price < 10000) {
    return discount;
  }
  if (price >= 10000 && price <= 20000) {
    const result = Math.max(discount - 1, 0);
    return result;
  }
  if (price >= 20000 && price <= 30000) {
    const result = Math.max(discount - 2, 0);
    return result;
  }
  const result = Math.max(discount - 3, 0);
  return result;
};

export const getMockProduct = (): Product => {
  const product: Product = {
    id: datatype.number(10),
    name: commerce.productName(),
    vendorCode: datatype.uuid(),
    type: helpers.randomize([
      'Цифровая',
      'Плёночная',
      'Моментальная',
      'Коллекционная',
    ]),
    category: helpers.randomize(['Фотоаппарат', 'Видеокамера']),
    description: lorem.paragraph(),
    level: helpers.randomize(['Нулевой', 'Любительский', 'Профессиональный']),
    price: +commerce.price(1990, 199990),
    rating: datatype.number(5),
    reviewCount: datatype.number(10),
    previewImg: image.image(),
    previewImg2x: image.imageUrl(),
    previewImgWebp: image.image(),
    previewImgWebp2x: image.image(),
  };

  return product;
};

export const getMockReview = (): Review => {
  const review: Review = {
    id: datatype.uuid(),
    createAt: datatype.datetime().toLocaleString(),
    cameraId: datatype.number(10),
    userName: name.firstName(),
    advantage: lorem.sentence(),
    disadvantage: lorem.sentence(),
    review: lorem.paragraph(),
    rating: datatype.number(5),
  };

  return review;
};
