import { FilterOption, NameSpace } from '../../const/const';
import { getFilterParams } from './selectors';

describe('FilterSlice selectors', () => {
  it('should return filterState', () => {
    const state = {
      [NameSpace.Filter]: {
        sort: FilterOption.sort[0].value,
        order: FilterOption.order[0].value,
        price: null,
        priceUp: null,
        category: '',
        type: [],
        level: [],
        page: null,
        tab: FilterOption.tab[0].value,
      },
    };
    const result = getFilterParams(state);
    expect(result).toEqual(state[NameSpace.Filter]);
  });
});
