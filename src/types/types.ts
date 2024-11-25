import { FilterState } from '../store/filter-slice/filter-slice';

export type Product = {
  id: number;
  name: string;
  vendorCode: string;
  type: string;
  category: string;
  description: string;
  level: string;
  price: number;
  rating: number;
  reviewCount: number;
  previewImg: string;
  previewImg2x: string;
  previewImgWebp: string;
  previewImgWebp2x: string;
};

export type Products = Product[];

export type Review = {
  id: string;
  createAt: string;
  cameraId: number;
  userName: string;
  advantage: string;
  disadvantage: string;
  review: string;
  rating: number;
};

export type Reviews = Review[];

export type Order = {
  camerasIds: number[];
  coupon: string | null;
  tel?: string;
};

export type FilterOptionsItem = {
  id: string;
  title: string;
  value: string;
}[];

export type FitlerOptions = {
  sort: FilterOptionsItem;
  order: FilterOptionsItem;
  price: FilterOptionsItem;
  priceUp: FilterOptionsItem;
  category: FilterOptionsItem;
  type: FilterOptionsItem;
  level: FilterOptionsItem;
  page: FilterOptionsItem;
  tab: FilterOptionsItem;
};

export type updateURLProps = {
  param: string;
  prop?: string;
  action: 'set' | 'delete' | 'append';
}[];

export type UpdateUrl = (data: updateURLProps) => void;

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type SetFilterStateOptions<K, V> = {
  key: K;
  value: V;
}[];

export type HandleFilterChange = <
  T extends FilterState,
  K extends keyof T,
  V extends T[K]
>(
  state: T,
  options: SetFilterStateOptions<K, V>
) => void;

export type PossibleFilterItemValues<T> = {
  [K in keyof T]: FilterOptionsItem;
};
