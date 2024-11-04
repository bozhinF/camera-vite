import { combineReducers } from '@reduxjs/toolkit';
import { NameSpace } from '../const/const';
import { productsSlice } from './products-slice/products-slice';
import { filterSlice } from './filter-slice/filter-slice';

export const rootReducer = combineReducers({
  [NameSpace.Products]: productsSlice.reducer,
  [NameSpace.Filter]: filterSlice.reducer,
});
