import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { filterOptions, NameSpace } from '../../const/const';

export type FilterState = {
  sort: string;
  order: string;
  price: string | null;
  priceUp: string | null;
  category: string | null;
  type: string[];
  level: string[];
};

export const initialState: FilterState = {
  sort: filterOptions.sort[0].value,
  order: filterOptions.order[0].value,
  price: null,
  priceUp: null,
  category: null,
  type: [],
  level: [],
};

export const filterSlice = createSlice({
  name: NameSpace.Filter,
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<FilterState>) {
      state.order = action.payload.order;
      state.sort = action.payload.sort;
      state.price = action.payload.price;
      state.priceUp = action.payload.priceUp;
      state.category = action.payload.category;
      state.type = action.payload.type;
      state.level = action.payload.level;
    },
  },
});

export const { setFilters } = filterSlice.actions;
