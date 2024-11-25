import { FilterOption } from '../../const/const';
import { FilterState } from '../../store/filter-slice/filter-slice';
import { HandleFilterChange } from '../../types/types';

type SortProps = {
  filterState: FilterState;
  onSortChange: HandleFilterChange;
};

function Sort({ filterState, onSortChange }: SortProps): JSX.Element {
  const handleSortChange = (key: 'sort' | 'order', value: string) =>
    onSortChange({ ...filterState }, [{ key, value }]);

  return (
    <div className="catalog-sort">
      <form action="#">
        <div className="catalog-sort__inner">
          <p className="title title--h5">Сортировать:</p>
          <div className="catalog-sort__type">
            {Object.values(FilterOption.sort).map(({ id, title, value }) => (
              <div key={id} className="catalog-sort__btn-text">
                <input
                  type="radio"
                  id={id}
                  name="sort"
                  checked={filterState.sort === value}
                  onChange={() => handleSortChange('sort', value)}
                />
                <label htmlFor={id}>{title}</label>
              </div>
            ))}
          </div>
          <div className="catalog-sort__order">
            {Object.values(FilterOption.order).map(({ id, title, value }) => (
              <div
                key={id}
                className={`catalog-sort__btn catalog-sort__btn--${id}`}
              >
                <input
                  type="radio"
                  id={id}
                  name="sort-icon"
                  checked={filterState.order === value}
                  aria-label={title}
                  onChange={() => handleSortChange('order', value)}
                />
                <label htmlFor={id}>
                  <svg width="16" height="14" aria-hidden="true">
                    <use xlinkHref="#icon-sort"></use>
                  </svg>
                </label>
              </div>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
}

export default Sort;
