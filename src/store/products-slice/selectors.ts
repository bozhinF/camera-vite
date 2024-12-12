import { NameSpace, RequestStatus } from '../../const/const';
import { State } from '../../types/state';
import { Product, Products, Reviews } from '../../types/types';

export const getAllProducts = (
  state: Pick<State, NameSpace.Products>
): Products => state[NameSpace.Products].allProducts;

export const getAllProductsStatus = (
  state: Pick<State, NameSpace.Products>
): RequestStatus => state[NameSpace.Products].allProductsStatus;

export const getProductDetails = (
  state: Pick<State, NameSpace.Products>
): Product | null => state[NameSpace.Products].productDetails;

export const getProductDetailsStatus = (
  state: Pick<State, NameSpace.Products>
): RequestStatus => state[NameSpace.Products].productDetailsStatus;

export const getProductReviews = (
  state: Pick<State, NameSpace.Products>
): Reviews => state[NameSpace.Products].productReviews;

export const getPostOrderStatus = (
  state: Pick<State, NameSpace.Products>
): RequestStatus => state[NameSpace.Products].postOrderStatus;

export const getBasket = (state: Pick<State, NameSpace.Products>): number[] =>
  state[NameSpace.Products].basket;
