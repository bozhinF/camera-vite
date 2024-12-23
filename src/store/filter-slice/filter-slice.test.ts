import { FilterOption } from '../../const/const';
import { filterSlice, setFilters } from './filter-slice';

describe('FilterSlice', () => {
  const emptyAction = { type: '' };
  const expectedState = {
    sort: FilterOption.sort[0].value,
    order: FilterOption.order[0].value,
    price: null,
    priceUp: null,
    category: '',
    type: [],
    level: [],
    page: null,
    tab: FilterOption.tab[0].value,
  };

  it('should return initial state with empty action', () => {
    const result = filterSlice.reducer(expectedState, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const result = filterSlice.reducer(undefined, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should set filters with "setFilters" action', () => {
    const expectedReducedState = {
      sort: FilterOption.sort[1].value,
      order: FilterOption.order[1].value,
      price: 1990,
      priceUp: 199000,
      category: 'photocamera',
      type: ['digital', 'collection'],
      level: ['professional'],
      page: 3,
      tab: 'description',
    };

    const result = filterSlice.reducer(
      undefined,
      setFilters(expectedReducedState)
    );

    expect(result).toEqual(expectedReducedState);
  });
});
