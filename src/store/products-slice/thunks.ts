import { createAsyncThunk } from '@reduxjs/toolkit';
import { Products } from '../../types/types';
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
