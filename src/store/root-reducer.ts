import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../const/const';
import { productsSlice } from './products-slice/products-slice';

export const rootReducer = combineReducers({
  [NameSpace.Products]: productsSlice.reducer,
});
