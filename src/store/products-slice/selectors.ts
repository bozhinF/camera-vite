import { NameSpace, RequestStatus } from '../../const/const';
import { State } from '../../types/state';
import { Products } from '../../types/types';

export const getAllProducts = (
  state: Pick<State, NameSpace.Products>
): Products => state[NameSpace.Products].allProducts;

export const getAllProductsStatus = (
  state: Pick<State, NameSpace.Products>
): RequestStatus => state[NameSpace.Products].allProductsStatus;
