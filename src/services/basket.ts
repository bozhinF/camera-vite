const BASKET_KEY = 'camera-shop_basket';

export const dropLocalBasket = () => localStorage.removeItem(BASKET_KEY);

export const getLocalBasket = () => {
  const localData = localStorage.getItem(BASKET_KEY);
  if (localData) {
    return JSON.parse(localData) as number[];
  }
  return [];
};
export const saveLocalBasket = (basket: number[]) => {
  if (basket.length) {
    localStorage.setItem(BASKET_KEY, JSON.stringify(basket));
    return;
  }
  dropLocalBasket();
};
