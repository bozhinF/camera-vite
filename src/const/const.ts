import { FitlerOptions } from '../types/types';

export enum AppRoute {
  Main = '/',
  Catalog = '/catalog',
  Basket = '/catalog/basket',
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

export const FilterOption: FitlerOptions = {
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
    { id: 'photocamera', title: 'Фотоаппарат', value: 'photocamera' },
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
  page: [{ id: 'Page', title: 'Страница', value: '' }],
  tab: [
    {
      id: 'characteristics',
      title: 'Характеристики',
      value: 'characteristics',
    },
    { id: 'description', title: 'Описание', value: 'description' },
  ],
} as const;

export enum ElementRole {
  Button = 'button',
  Link = 'link',
  Image = 'img',
}

export enum ElementAttribute {
  Src = 'src',
  Width = 'width',
  Height = 'height',
  Href = 'href',
  Type = 'type',
}

export enum ElementTag {
  Div = 'div',
}

export enum UserEventKey {
  Tab = '{Tab}',
  ShiftTab = '{Shift>}{Tab}{/Shift}',
}
