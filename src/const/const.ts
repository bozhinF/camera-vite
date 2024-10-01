export enum AppRoute {
  Main = '/',
  Basket = '/basket',
  Catalog = '/catalog',
  Product = '/product',
}

export const Crumb = {
  Main: 'Главная',
  Basket: 'Корзина',
  Catalog: 'Каталог',
  Product: 'Продукт',
} as const;
