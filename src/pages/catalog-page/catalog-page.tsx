import { useEffect, useRef, useState } from 'react';
import Banner from '../../components/banner/banner';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';
import ProductCard from '../../components/product-card/product-card';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getAllProducts } from '../../store/products-slice/selectors';
import Portal from '../../components/portal/portal';
import CallItemModal from '../../components/call-item-modal/call-item-modal';
import { Product, updateURLProps } from '../../types/types';
import { Helmet } from 'react-helmet-async';
import Sort from '../../components/sort/sort';
import Filter from '../../components/filter/filter';
import { useLocation, useSearchParams } from 'react-router-dom';
import { getFilterParams } from '../../store/filter-slice/selectors';
import { filterOptions } from '../../const/const';
import {
  FilterState,
  initialState,
  setFilters,
} from '../../store/filter-slice/filter-slice';

function CatalogPage(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callItem, setCallItem] = useState<Product | null>(null);
  const products = useAppSelector(getAllProducts);
  const [searchParams, setSearchParams] = useSearchParams();
  const filterState = useAppSelector(getFilterParams);
  const dispatch = useAppDispatch();
  const isMounted = useRef(false);
  const location = useLocation();

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

  useEffect(() => {
    const currentFilter: FilterState = { ...filterState };
    let isNeedToUpdate = false;
    if (!location.search) {
      Object.entries(currentFilter).forEach(([key, value]) => {
        const typedKey = key as keyof typeof currentFilter;
        if (value !== initialState[typedKey]) {
          currentFilter[typedKey] = initialState[typedKey] as string & string[];
        }
        isNeedToUpdate = true;
      });
    }

    if (location.search) {
      const params = new URLSearchParams(location.search);
      const filterItems = Object.keys(
        currentFilter
      ) as (keyof typeof currentFilter)[];

      filterItems.forEach((key) => {
        const param = params.get(key);
        if (param === null) {
          const value = initialState[key];
          currentFilter[key] = value as string & string[];
          isNeedToUpdate = true;
        }

        const isValidParam = filterOptions[key].some((item) => {
          if (item.id === 'price' || item.id === 'priceUp') {
            return true;
          }
          return item.value === param;
        });

        if (
          isValidParam &&
          currentFilter[key] !== param &&
          key !== 'type' &&
          key !== 'level'
        ) {
          isNeedToUpdate = true;
          currentFilter[key] = String(param);
        }
        if (key === 'type' || key === 'level') {
          const allParams = params.getAll(key);
          const filterParams = currentFilter[key];
          const sortedData = [...allParams].sort((a, b) => a.localeCompare(b));
          const sortedSelected = [...filterParams].sort((a, b) =>
            a.localeCompare(b)
          );
          const isArraysEqual =
            sortedData.toString() === sortedSelected.toString();
          if (!isArraysEqual) {
            currentFilter[key] = allParams;
            isNeedToUpdate = true;
          }
        }
      });
    }

    if (isNeedToUpdate) {
      dispatch(setFilters(currentFilter));
    }

    isMounted.current = true;
  }, [dispatch, filterState, location.search]);

  const handleBuyButtonClick = (product: Product) => {
    setIsModalOpen(true);
    setCallItem(product);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCallItem(null);
  };

  return (
    <main>
      <Helmet>
        <title>Каталог - Фотошоп</title>
      </Helmet>
      {isModalOpen && (
        <Portal isOpen={isModalOpen} onModalClose={handleModalClose}>
          <CallItemModal
            callItem={callItem}
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
                <img src="img/banner.png" />
                <Filter filterState={filterState} onChange={updateURL} />
              </div>
              <div className="catalog__content">
                <Sort filterState={filterState} onSortChange={updateURL} />
                <div className="cards catalog__cards">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onBuyButtonClick={handleBuyButtonClick}
                    />
                  ))}
                </div>
                {/*<div class="pagination">
              <ul class="pagination__list">
                <li class="pagination__item"><a class="pagination__link pagination__link&#45;&#45;active" href="1">1</a>
                </li>
                <li class="pagination__item"><a class="pagination__link" href="2">2</a>
                </li>
                <li class="pagination__item"><a class="pagination__link" href="3">3</a>
                </li>
                <li class="pagination__item"><a class="pagination__link pagination__link&#45;&#45;text" href="2">Далее</a>
                </li>
              </ul>
            </div>*/}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CatalogPage;
