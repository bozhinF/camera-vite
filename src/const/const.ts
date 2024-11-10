import { FitlerOptions } from '../types/types';

export enum AppRoute {
  Main = '/',
  Basket = '/basket',
  Catalog = '/catalog',
  Product = '/catalog/product/:id',
}

export const Crumb = {
  Main: 'Главная',
  Basket: 'Корзина',
  Catalog: 'Каталог',
} as const;

export enum RequestStatus {
  Idle = 'Idle',
  Loading = 'Loading',
  Success = 'Success',
  Failed = 'Failed',
}

export enum NameSpace {
  Products = 'PRODUCTS',
  Filter = 'FILTER',
}

export enum Endpoint {
  Products = '/cameras',
  Comments = '/cameras/:cameraId/reviews',
  Orders = '/orders',
}

export const filterOptions: FitlerOptions = {
  sort: [
    { id: 'sortPrice', title: 'по цене', value: 'price' },
    {
      id: 'sortPopular',
      title: 'по популярности',
      value: 'popular',
    },
  ],
  order: [
    { id: 'up', title: 'По возрастанию', value: 'up' },
    { id: 'down', title: 'По убыванию', value: 'down' },
  ],
  price: [{ id: 'price', title: 'от', value: '' }],
  priceUp: [{ id: 'priceUp', title: 'до', value: '' }],
  category: [
    { id: 'photocamera', title: 'Фотокамера', value: 'photocamera' },
    { id: 'videocamera', title: 'Видеокамера', value: 'videocamera' },
  ],
  type: [
    { id: 'digital', title: 'Цифровая', value: 'digital' },
    { id: 'film', title: 'Плёночная', value: 'film' },
    { id: 'snapshot', title: 'Моментальная', value: 'snapshot' },
    { id: 'collection', title: 'Коллекционная', value: 'collection' },
  ],
  level: [
    { id: 'zero', title: 'Нулевой', value: 'zero' },
    {
      id: 'non-professional',
      title: 'Любительский',
      value: 'non-professional',
    },
    { id: 'professional', title: 'Профессиональный', value: 'professional' },
  ],
};
