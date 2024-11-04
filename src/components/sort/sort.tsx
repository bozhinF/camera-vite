import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getFilterParams } from '../../store/filter-slice/selectors';
import { useEffect, useRef } from 'react';
import { filterOptions } from '../../const/const';
import { setFilters } from '../../store/filter-slice/filter-slice';

function Sort(): JSX.Element {
  const isMounted = useRef(false);
  const filterState = useAppSelector(getFilterParams);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const updateURL = (param: string, prop: string) => {
    const params = new URLSearchParams(location.search);
    params.set(param, prop);
    navigate(`${location.pathname}?${params.toString()}`);
  };

  const handleSortChange = (key: string, value: string) =>
    updateURL(key, value);

  useEffect(() => {
    const currentFilter = { ...filterState };
    let isNeedToUpdate = false;

    if (location.search) {
      const params = new URLSearchParams(location.search);
      const filterItems = Object.keys(
        currentFilter
      ) as (keyof typeof currentFilter)[];

      filterItems.forEach((key) => {
        const param = params.get(key);
        const isValidParam = filterOptions[key].some(
          (item) => item.value === param
        );
        if (isValidParam && currentFilter[key] !== String(param)) {
          isNeedToUpdate = true;
          currentFilter[key] = String(param);
        }
      });
    }

    if (isNeedToUpdate) {
      dispatch(setFilters(currentFilter));
    }

    isMounted.current = true;
  }, [dispatch, filterState, location.search]);

  return (
    <div className="catalog-sort">
      <form action="#">
        <div className="catalog-sort__inner">
          <p className="title title--h5">Сортировать:</p>
          <div className="catalog-sort__type">
            {Object.values(filterOptions.sort).map(({ id, title, value }) => (
              <div key={id} className="catalog-sort__btn-text">
                <input
                  type="radio"
                  id={id}
                  name="sort"
                  checked={filterState.sort === value && isMounted.current}
                  onChange={() => handleSortChange('sort', value)}
                />
                <label htmlFor={id}>{title}</label>
              </div>
            ))}
          </div>
          <div className="catalog-sort__order">
            {Object.values(filterOptions.order).map(({ id, title, value }) => (
              <div
                key={id}
                className={`catalog-sort__btn catalog-sort__btn--${id}`}
              >
                <input
                  type="radio"
                  id={id}
                  name="sort-icon"
                  checked={filterState.order === value && isMounted.current}
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
