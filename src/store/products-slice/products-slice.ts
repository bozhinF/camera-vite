import { createSlice } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const/const';
import { Product, Products, Reviews } from '../../types/types';
import {
  fetchAllProducts,
  fetchProduct,
  fetchProductReviews,
  postOrder,
} from './thunks';

type ProductsState = {
  allProductsStatus: RequestStatus;
  allProducts: Products;
  productDetailsStatus: RequestStatus;
  productDetails: Product | null;
  productReviewsStatus: RequestStatus;
  productReviews: Reviews;
  postOrderStatus: RequestStatus;
};

const initialState: ProductsState = {
  allProductsStatus: RequestStatus.Idle,
  allProducts: [],
  productDetailsStatus: RequestStatus.Idle,
  productDetails: null,
  productReviewsStatus: RequestStatus.Idle,
  productReviews: [],
  postOrderStatus: RequestStatus.Idle,
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
      })
      .addCase(fetchProduct.pending, (state) => {
        state.productDetailsStatus = RequestStatus.Loading;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.productDetailsStatus = RequestStatus.Success;
        state.productDetails = action.payload;
      })
      .addCase(fetchProduct.rejected, (state) => {
        state.productDetailsStatus = RequestStatus.Failed;
      })
      .addCase(fetchProductReviews.pending, (state) => {
        state.productReviewsStatus = RequestStatus.Loading;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.productDetailsStatus = RequestStatus.Success;
        state.productReviews = action.payload;
      })
      .addCase(fetchProductReviews.rejected, (state) => {
        state.productReviewsStatus = RequestStatus.Failed;
      })
      .addCase(postOrder.pending, (state) => {
        state.postOrderStatus = RequestStatus.Loading;
      })
      .addCase(postOrder.fulfilled, (state) => {
        state.postOrderStatus = RequestStatus.Success;
      })
      .addCase(postOrder.rejected, (state) => {
        state.postOrderStatus = RequestStatus.Failed;
      }),
});
