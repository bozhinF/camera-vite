import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const/const';
import { Products } from '../../types/types';
import { fetchAllProducts } from './thunks';

type ProductsState = {
  allProductsStatus: RequestStatus;
  allProducts: Products;
};

const initialState: ProductsState = {
  allProductsStatus: RequestStatus.Idle,
  allProducts: [],
};

export const productsSlice = createSlice({
  name: NameSpace.Products,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.allProductsStatus = RequestStatus.Loading;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.allProductsStatus = RequestStatus.Success;
        state.allProducts = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.allProductsStatus = RequestStatus.Failed;
      }),
});
