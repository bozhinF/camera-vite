import { createAsyncThunk } from '@reduxjs/toolkit';
import { Product, Products, Reviews } from '../../types/types';
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
