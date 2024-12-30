import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  Coupon,
  CouponResponse,
  Order,
  Product,
  Products,
  Reviews,
} from '../../types/types';
import { AxiosInstance } from 'axios';
import { Endpoint } from '../../const/const';

export const fetchAllProducts = createAsyncThunk<
  Products,
  undefined,
  { extra: AxiosInstance }
>('fetchProducts/all', async (_arg, { extra: api }) => {
  const response = await api.get<Products>(Endpoint.Products);
  return response.data;
});

export const fetchProduct = createAsyncThunk<
  Product,
  { id: string },
  { extra: AxiosInstance }
>('fetchProducts/product', async ({ id }, { extra: api }) => {
  const response = await api.get<Product>(`${Endpoint.Products}/${id}`);
  return response.data;
});

export const fetchProductReviews = createAsyncThunk<
  Reviews,
  { id: string },
  { extra: AxiosInstance }
>('fetchProduct/reviews', async ({ id }, { extra: api }) => {
  const response = await api.get<Reviews>(
    `${Endpoint.Comments.replace(':cameraId', id)}`
  );
  return response.data;
});

export const postOrder = createAsyncThunk<
  void,
  { order: Order },
  { extra: AxiosInstance }
>('postProduct/order', async ({ order }, { extra: api }) => {
  await api.post(Endpoint.Orders, order);
});

export const postCoupon = createAsyncThunk<
  CouponResponse,
  { coupon: Coupon },
  { extra: AxiosInstance }
>('postProduct/coupon', async (coupon, { extra: api }) => {
  const response = await api.post<CouponResponse>(Endpoint.Coupons, coupon);
  return response.data;
});
