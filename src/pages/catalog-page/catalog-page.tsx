import { useCallback, useEffect, useRef, useState } from 'react';
import Banner from '../../components/banner/banner';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';
import ProductCard from '../../components/product-card/product-card';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getAllProducts } from '../../store/products-slice/selectors';
import Portal from '../../components/portal/portal';
import {
  HandleFilterChange,
  Product,
  Products,
  SetFilterStateOptions,
  updateURLProps,
} from '../../types/types';
import { Helmet } from 'react-helmet-async';
import Sort from '../../components/sort/sort';
import Filter from '../../components/filter/filter';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getFilterParams } from '../../store/filter-slice/selectors';
import { FilterOption } from '../../const/const';
import {
  FilterState,
  initialState,
  setFilters,
} from '../../store/filter-slice/filter-slice';
import {
  filter,
  getObjectKeys,
  getSelectedFilterOptions,
  getTitleByValue,
  setFilterStateFromParams,
  sort,
} from '../../util/util';
import Pagination from '../../components/pagination/pagination';
import AddItemModal from '../../components/add-item-modal/add-item-modal';

const MAX_PRODUCTS_CARD_ON_PAGE = 9;

function CatalogPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const products = useAppSelector(getAllProducts);
  const filterState = useAppSelector(getFilterParams);

  const isMounted = useRef(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [addItem, setAddItem] = useState<Product | null>(null);

  const currentPage = filterState.page ? filterState.page : 1;
  const sortValue = filterState.sort;
  const orderValue = filterState.order;

  const selectedFilterOptions = getSelectedFilterOptions(filterState);

  const filteredProducts = selectedFilterOptions.reduce(
    (selectedProducts: Products, option) => {
      if (option === 'category' && filterState.category) {
        const category = getTitleByValue(
          FilterOption,
          option,
          filterState.category
        );
        if (category !== null && !Array.isArray(category)) {
          return filter.category(selectedProducts, category);
        }
        return selectedProducts;
      }
      if (option === 'type') {
        const types = getTitleByValue(FilterOption, option, filterState.type);
        if (types !== null && Array.isArray(types) && types.length) {
          return filter.type(selectedProducts, types);
        }
        return selectedProducts;
      }
      if (option === 'level') {
        const levels = getTitleByValue(FilterOption, option, filterState.level);
        if (levels !== null && Array.isArray(levels) && levels.length) {
          return filter.level(selectedProducts, levels);
        }
        return selectedProducts;
      }
      return selectedProducts;
    },
    products
  );

  const filteredByPriceProducts = selectedFilterOptions.reduce(
    (selectedProducts: Products, option) => {
      if (option === 'price' && filterState.price && filterState.priceUp) {
        return filter.price(selectedProducts, {
          from: +filterState.price,
          to: +filterState.priceUp,
        });
      }
      return selectedProducts;
    },
    filteredProducts
  );

  const sortedProducts = sort[sortValue as 'price' | 'popular'](
    filteredByPriceProducts,
    orderValue as 'up' | 'down'
  );

  const countPages = Math.ceil(
    sortedProducts.length / MAX_PRODUCTS_CARD_ON_PAGE
  );

  const currentPageProducts = sortedProducts.slice(
    MAX_PRODUCTS_CARD_ON_PAGE * (currentPage - 1),
    MAX_PRODUCTS_CARD_ON_PAGE * (currentPage - 1) + MAX_PRODUCTS_CARD_ON_PAGE
  );

  const updateURL = (data: updateURLProps) => {
    data.forEach(({ param, prop, action }) => {
      if (prop) {
        searchParams[action](param, prop);
        return;
      }
      searchParams.delete(param);
    });
    setSearchParams(searchParams.toString(), { replace: true });
  };

  function setFilterState<
    T extends FilterState,
    K extends keyof T,
    V extends T[K]
  >(state: T, options: SetFilterStateOptions<K, V>) {
    options.forEach(({ key, value }) => {
      state[key] = value;
    });
    dispatch(setFilters(state));
    return state;
  }

  const updateURLFromState = useCallback(
    <T extends FilterState, K extends keyof T>(state: T, keys: K[]) => {
      keys.forEach((key) => {
        const value = state[key] as FilterState[keyof FilterState];
        if (value === null || value === '') {
          searchParams.delete(String(key));
          return;
        }
        if (Array.isArray(value)) {
          searchParams.delete(String(key));
          if (value.length) {
            value.forEach((item) => searchParams.append(String(key), item));
          }
          return;
        }
        searchParams.set(String(key), String(value));
      });
      setSearchParams(searchParams.toString(), { replace: true });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    const currentFilter: FilterState = { ...filterState };
    if (location.search && !isMounted.current) {
      const params = searchParams;
      const invalidParams = setFilterStateFromParams(
        currentFilter,
        FilterOption,
        params
      );
      const currentFilterEqualFilterState = getObjectKeys(currentFilter).every(
        (key) => currentFilter[key] === filterState[key]
      );
      const tabParam = params.get('tab');
      if (tabParam) {
        invalidParams.push({ param: 'tab', action: 'delete' });
      }
      if (!currentFilterEqualFilterState) {
        dispatch(setFilters(currentFilter));
      }
      if (invalidParams.length) {
        updateURL(invalidParams);
      }
    }
    isMounted.current = true;
  });

  useEffect(() => {
    if (!location.search && isMounted.current) {
      const currentFilter: FilterState = { ...filterState };
      const keys = getObjectKeys(currentFilter);
      const filteredKeys = [...keys].filter((key) => {
        if (
          Array.isArray(currentFilter[key]) &&
          Array.isArray(initialState[key])
        ) {
          const currentValue = currentFilter[key] as string[];
          const initialValue = initialState[key] as string[];
          return currentValue.join() !== initialValue.join();
        }
        return currentFilter[key] !== initialState[key] && key !== 'tab';
      });
      updateURLFromState(currentFilter, filteredKeys);
    }
  }, [filterState, location.search, updateURLFromState]);

  const handleFilterChange: HandleFilterChange = (state, options) => {
    const updatedState = setFilterState(state, options);
    const keys = options.map((option) => option.key);
    updateURLFromState(updatedState, keys);
  };

  const handleBuyButtonClick = (product: Product) => {
    setModalOpen(true);
    setAddItem(product);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setAddItem(null);
  };

  return (
    <main>
      <Helmet>
        <title>Каталог - Фотошоп</title>
      </Helmet>
      {isModalOpen && (
        <Portal isOpen={isModalOpen} onModalClose={handleModalClose}>
          <AddItemModal
            addItem={addItem}
            onCloseButtonClick={handleModalClose}
          />
        </Portal>
      )}

      <Banner />
      <div className="page-content">
        <Breadcrumbs />
        <section className="catalog">
          <div className="container">
            <h1 className="title title--h2">Каталог фото- и видеотехники</h1>
            <div className="page-content__columns">
              <div className="catalog__aside">
                <Filter
                  filterState={filterState}
                  filteredProducts={filteredProducts}
                  onChange={handleFilterChange}
                />
              </div>
              <div className="catalog__content">
                <Sort
                  filterState={filterState}
                  onSortChange={handleFilterChange}
                />
                <div className="cards catalog__cards">
                  {currentPageProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onBuyButtonClick={handleBuyButtonClick}
                    />
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  countPages={countPages}
                  filterState={filterState}
                  onChange={handleFilterChange}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CatalogPage;
