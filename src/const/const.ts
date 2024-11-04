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
  Product: 'Продукт',
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

export const filterOptions = {
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
};
