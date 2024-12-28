import { useParams, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useEffect, useRef, useState } from 'react';
import {
  fetchProduct,
  fetchProductReviews,
} from '../../store/products-slice/thunks';
import {
  getBasket,
  getProductDetails,
  getProductDetailsStatus,
  getProductReviews,
} from '../../store/products-slice/selectors';
import { FilterOption, RequestStatus } from '../../const/const';
import Loader from '../../components/loader/loader';
import NotFoundPage from '../not-found-page/not-found-page';
import Tabs from '../../components/tabs/tabs';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';
import StarsRating from '../../components/stars-rating/stars-rating';
import ReviewsList from '../../components/reviews-list/reviews-list';
import { Helmet } from 'react-helmet-async';
import { getFilterParams } from '../../store/filter-slice/selectors';
import {
  FilterState,
  initialState,
  setFilters,
} from '../../store/filter-slice/filter-slice';
import { HandleFilterChange, SetFilterStateOptions } from '../../types/types';
import { getObjectKeys, setFilterStateFromParams } from '../../util/util';
import { updateBasket } from '../../store/products-slice/products-slice';
import ProductImage from '../../components/product-image/product-image';
import Portal from '../../components/portal/portal';
import AddItemModal from '../../components/add-item-modal/add-item-modal';
import AddItemSuccessModal from '../../components/add-item-success-modal/add-item-success-modal';

enum ImageSize {
  Width = 140,
  Height = 120,
}

function ProductPage(): JSX.Element {
  const dispatch = useAppDispatch();

  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const filterState = useAppSelector(getFilterParams);
  const productDetails = useAppSelector(getProductDetails);
  const productDetailsStatus = useAppSelector(getProductDetailsStatus);
  const productReviews = useAppSelector(getProductReviews);
  const basket = useAppSelector(getBasket);
  const countProuductInBasket = basket.filter(
    (item) => item === productDetails?.id
  ).length;

  const isMounted = useRef(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isAddModalActive, setModalActive] = useState(true);

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

  function updateURLFromState<T extends FilterState, K extends keyof T>(
    state: T,
    keys: K[]
  ) {
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
  }

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct({ id }));
      dispatch(fetchProductReviews({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    const currentFilter: FilterState = { ...filterState };
    if (location.search && !isMounted.current) {
      const params = searchParams;
      const tabParamValue = params.get('tab');
      if (tabParamValue) {
        currentFilter.tab = tabParamValue;
      }
      const currentFilterEqualFilterState =
        currentFilter.tab === filterState.tab;
      if (!currentFilterEqualFilterState) {
        dispatch(setFilters(currentFilter));
      }
      setFilterStateFromParams(currentFilter, FilterOption, params);
    }
    isMounted.current = true;
  });

  useEffect(() => {
    if (!location.search && isMounted.current) {
      const currentFilter: FilterState = { ...filterState };
      const keys = getObjectKeys(currentFilter).filter(
        (key) => key === 'tab' && currentFilter[key] !== initialState[key]
      );
      if (keys?.length) {
        updateURLFromState(currentFilter, keys);
      }
    }
  });

  const handleFilterChange: HandleFilterChange = (state, options) => {
    const updatedState = setFilterState(state, options);
    const keys = options.map((option) => option.key);
    updateURLFromState(updatedState, keys);
  };

  const handleUpButtonClick: React.MouseEventHandler<HTMLAnchorElement> = (
    event
  ) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  if (
    productDetailsStatus === RequestStatus.Loading ||
    productDetailsStatus === RequestStatus.Idle
  ) {
    return <Loader />;
  }

  if (!productDetails) {
    return <NotFoundPage />;
  }

  const { name, price, rating, reviewCount } = productDetails;

  window.scrollTo({
    top: 0,
    left: 0,
  });

  const handleBuyButtonClick = () => {
    if (countProuductInBasket < 9) {
      setModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalActive(true);
  };
  const handleAddButtonClick = () => {
    if (countProuductInBasket < 9) {
      dispatch(updateBasket([...basket, productDetails.id]));
      setModalActive(false);
    }
  };

  return (
    <>
      <main>
        <Helmet>
          <title>Продукт - Фотошоп</title>
        </Helmet>
        {isModalOpen && (
          <Portal isOpen={isModalOpen} onModalClose={handleModalClose}>
            {isAddModalActive ? (
              <AddItemModal
                addItem={productDetails}
                onCloseButtonClick={handleModalClose}
                onBuyButtonClick={handleAddButtonClick}
              />
            ) : (
              <AddItemSuccessModal onCloseButtonClick={handleModalClose} />
            )}
          </Portal>
        )}
        <div className="page-content">
          <Breadcrumbs tip={name} />
          <div className="page-content__section">
            <section className="product">
              <div className="container">
                <div className="product__img">
                  <ProductImage
                    image={productDetails}
                    size={{ width: ImageSize.Width, height: ImageSize.Height }}
                  />
                </div>
                <div className="product__content">
                  <h1 className="title title--h3">{name}</h1>
                  <StarsRating rating={rating} reviewCount={reviewCount} />
                  <p className="product__price">
                    <span className="visually-hidden">Цена:</span>
                    {price.toLocaleString('ru')} ₽
                  </p>
                  <button
                    className="btn btn--purple btn--purple-border"
                    type="button"
                    onClick={handleBuyButtonClick}
                  >
                    <svg width={24} height={16} aria-hidden="true">
                      <use xlinkHref="#icon-add-basket" />
                    </svg>
                    Добавить в корзину
                  </button>
                  <Tabs
                    product={productDetails}
                    onChange={handleFilterChange}
                    filterState={filterState}
                  />
                </div>
              </div>
            </section>
          </div>
          <div className="page-content__section">
            <ReviewsList reviews={productReviews} />
          </div>
        </div>
      </main>
      <a
        className="up-btn"
        href="#header"
        onClick={handleUpButtonClick}
        data-testid="up-btn"
      >
        <svg width="12" height="18" aria-hidden="true">
          <use xlinkHref="#icon-arrow2"></use>
        </svg>
      </a>
    </>
  );
}

export default ProductPage;
