import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NameSpace, RequestStatus } from '../../const/const';
import { Product, Products, Reviews } from '../../types/types';
import {
  fetchAllProducts,
  fetchProduct,
  fetchProductReviews,
  postCoupon,
  postOrder,
} from './thunks';
import { saveLocalBasket } from '../../services/basket';

export type ProductsState = {
  allProductsStatus: RequestStatus;
  allProducts: Products;
  productDetailsStatus: RequestStatus;
  productDetails: Product | null;
  productReviewsStatus: RequestStatus;
  productReviews: Reviews;
  basket: number[];
  postOrderStatus: RequestStatus;
  couponDiscount: number;
  couponValidateStatus: RequestStatus;
};

const initialState: ProductsState = {
  allProductsStatus: RequestStatus.Idle,
  allProducts: [],
  productDetailsStatus: RequestStatus.Idle,
  productDetails: null,
  productReviewsStatus: RequestStatus.Idle,
  productReviews: [],
  basket: [],
  postOrderStatus: RequestStatus.Idle,
  couponDiscount: 0,
  couponValidateStatus: RequestStatus.Idle,
};

export const productsSlice = createSlice({
  name: NameSpace.Products,
  initialState,
  reducers: {
    updateBasket(state, action: PayloadAction<number[]>) {
      state.basket = action.payload;
      saveLocalBasket(action.payload);
    },
    setBasket(state, action: PayloadAction<number[]>) {
      state.basket = action.payload;
    },
    addItemToBasket(state, action: PayloadAction<number>) {
      const result = [...state.basket, action.payload];
      state.basket = result;
      saveLocalBasket(result);
    },
    removeItemFromBasket(state, action: PayloadAction<number>) {
      const id = action.payload;
      const basket = state.basket;
      const index = basket.lastIndexOf(id);
      if (index === -1) {
        return;
      }
      const result = [...basket.slice(0, index), ...basket.slice(index + 1)];
      state.basket = result;
      saveLocalBasket(result);
    },
    resetPostOrderStatus(state) {
      state.postOrderStatus = RequestStatus.Idle;
    },
    resetCoupon(state) {
      state.couponDiscount = 0;
      state.couponValidateStatus = RequestStatus.Idle;
    },
  },
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
        state.productReviewsStatus = RequestStatus.Success;
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
      })
      .addCase(postCoupon.pending, (state) => {
        state.couponValidateStatus = RequestStatus.Loading;
      })
      .addCase(postCoupon.fulfilled, (state, action) => {
        state.couponValidateStatus = RequestStatus.Success;
        const payload = action.payload;
        if (typeof payload === 'number') {
          state.couponDiscount = payload;
          state.couponValidateStatus = RequestStatus.Success;
        } else {
          state.couponDiscount = 0;
          state.couponValidateStatus = RequestStatus.Failed;
        }
      })
      .addCase(postCoupon.rejected, (state) => {
        state.couponValidateStatus = RequestStatus.Failed;
        state.couponDiscount = 0;
      }),
});

export const {
  setBasket,
  updateBasket,
  addItemToBasket,
  removeItemFromBasket,
  resetPostOrderStatus,
  resetCoupon,
} = productsSlice.actions;
