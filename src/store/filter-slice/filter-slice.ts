import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { filterOptions, NameSpace } from '../../const/const';

export type FilterState = {
  sort: string;
  order: string;
};

const initialState: FilterState = {
  sort: filterOptions.sort[0].value,
  order: filterOptions.order[0].value,
};

export const filterSlice = createSlice({
  name: NameSpace.Filter,
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<FilterState>) {
      state.order = action.payload.order;
      state.sort = action.payload.sort;
    },
  },
});

export const { setFilters } = filterSlice.actions;
