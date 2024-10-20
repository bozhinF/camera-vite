export enum AppRoute {
  Main = '/',
  Basket = '/basket',
  Catalog = '/catalog',
  Product = '/catalog/:id',
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
}

export enum Endpoint {
  Products = '/cameras',
  Comments = '/cameras/:cameraId/reviews',
  Orders = '/orders',
}
