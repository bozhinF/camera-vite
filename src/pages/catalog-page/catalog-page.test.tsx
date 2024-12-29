import {
  createBrowserHistory,
  createMemoryHistory,
  MemoryHistory,
} from 'history';
import { beforeEach } from 'vitest';
import {
  getMockFilterState,
  getMockProduct,
  getMockProductsState,
  getMockStore,
} from '../../util/mocks';
import {
  AppRoute,
  Crumb,
  FilterOption,
  NameSpace,
  RequestStatus,
} from '../../const/const';
import { withHistory, withStore } from '../../util/mock-component';
import CatalogPage from './catalog-page';
import { render, screen } from '@testing-library/react';
import HistoryRouter from '../../components/history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import { setFilters } from '../../store/filter-slice/filter-slice';

describe('Component: CatalogPage', () => {
  let mockHistory: MemoryHistory;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders banner', () => {
    const mockProductsState = getMockProductsState({
      allProductsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<CatalogPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    const imgElement = screen.getByRole('img', { name: /баннер/i });
    expect(imgElement).toBeInTheDocument();
  });

  it('should renders breadcrumbs', () => {
    const mockProductsState = getMockProductsState({
      allProductsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<CatalogPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    expect(screen.getByRole('link', { name: Crumb.Main })).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs-tip')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs-tip').textContent).toBe(
      Crumb.Catalog
    );
  });

  it('should renders page heading', () => {
    const expectedHeading = 'Каталог фото- и видеотехники';
    const mockProductsState = getMockProductsState({
      allProductsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<CatalogPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    expect(
      screen.getByRole('heading', { name: expectedHeading })
    ).toBeInTheDocument();
  });

  it('should renders sort', () => {
    const expectedSortTitle = 'Сортировать:';
    const mockProductsState = getMockProductsState({
      allProductsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<CatalogPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    expect(screen.getByText(expectedSortTitle)).toBeInTheDocument();
    Object.values(FilterOption.sort).forEach((option) => {
      expect(screen.getByLabelText(option.title)).toBeInTheDocument();
    });

    Object.values(FilterOption.order).forEach((option) => {
      expect(screen.getByLabelText(option.title)).toBeInTheDocument();
    });
  });

  it('should render filter', () => {
    const expectedFilterHeading = 'Фильтр';
    const expectedPriceInputTitle = 'Цена, ₽';
    const expectedCategoryTitle = 'Категория';
    const expectedTypeTitle = 'Тип камеры';
    const expectedLevelTitle = 'Уровень';
    const expectedResetButtonText = 'Сбросить фильтры';
    const mockProductsState = getMockProductsState({
      allProductsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<CatalogPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    expect(
      screen.getByRole('heading', { name: expectedFilterHeading })
    ).toBeInTheDocument();
    expect(screen.getByText(expectedPriceInputTitle)).toBeInTheDocument();
    expect(screen.getByText(expectedCategoryTitle)).toBeInTheDocument();
    expect(screen.getByText(expectedTypeTitle)).toBeInTheDocument();
    expect(screen.getByText(expectedLevelTitle)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: expectedResetButtonText })
    ).toBeInTheDocument();
  });

  it('should render products cards', () => {
    const mockProducts = Array.from({ length: 5 }, (_, i) =>
      getMockProduct({ id: i + 1, name: `Product ${i + 1}` })
    );
    const productsState = getMockProductsState({
      allProducts: mockProducts,
      allProductsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({
      [NameSpace.Products]: productsState,
    });
    const withHistoryComponent = withHistory(<CatalogPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    mockProducts.forEach((product) => {
      expect(screen.getByText(product.name)).toBeInTheDocument();
    });
  });

  it('should render pagination', () => {
    const expectedPaginationLinks = 3;
    const expectedNextLinkText = 'Далее';
    const mockProducts = Array.from({ length: 100 }, (_, i) =>
      getMockProduct({ id: i + 1, name: `Product ${i + 1}` })
    );
    const productsState = getMockProductsState({
      allProducts: mockProducts,
      allProductsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({
      [NameSpace.Products]: productsState,
    });
    const withHistoryComponent = withHistory(<CatalogPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    const pageLinks = screen.getAllByRole('link', { name: /\d+/ });
    expect(pageLinks).toHaveLength(expectedPaginationLinks);
    const nextLink = screen.getByText(expectedNextLinkText);
    expect(nextLink).toBeInTheDocument();
  });

  it('should render loader when loading cameras', () => {
    const expectedLoaderText = 'Loading...';
    const productsState = getMockProductsState({
      allProductsStatus: RequestStatus.Loading,
    });
    const mockStore = getMockStore({
      [NameSpace.Products]: productsState,
    });
    const withHistoryComponent = withHistory(<CatalogPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    expect(screen.getByText(expectedLoaderText)).toBeInTheDocument();
  });

  it('should render failed to load component when loading cameras failed', () => {
    const expectedLoadinFailedText = 'Ошибка загрузки информации';
    const productsState = getMockProductsState({
      allProductsStatus: RequestStatus.Failed,
    });
    const mockStore = getMockStore({
      [NameSpace.Products]: productsState,
    });
    const withHistoryComponent = withHistory(<CatalogPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    expect(screen.getByText(expectedLoadinFailedText)).toBeInTheDocument();
  });

  it('should dispatch setFilters when specified search parameters', () => {
    const searchParams =
      '?sort=popular&order=down&category=photocamera&type=digital&type=collection&level=professional';
    const mockState = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        allProductsStatus: RequestStatus.Success,
      }),
    });
    const expectedState = {
      sort: 'popular',
      order: 'down',
      price: null,
      priceUp: null,
      category: 'photocamera',
      type: ['digital', 'collection'],
      level: ['professional'],
      page: null,
      tab: FilterOption.tab[0].value,
    };
    const mockBrowserHistory = createBrowserHistory();
    const { withStoreComponent, mockStore } = withStore(
      <HistoryRouter history={mockBrowserHistory}>
        <HelmetProvider>
          <CatalogPage />
        </HelmetProvider>
      </HistoryRouter>,
      mockState
    );
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');
    mockBrowserHistory.push(`${AppRoute.Catalog}${searchParams}`);

    render(withStoreComponent);

    expect(dispatchSpy).toBeCalled();
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith(setFilters(expectedState));
  });

  it('should dispatch setFilters when a page number is specified in the search parameters', () => {
    const mockProducts = Array.from({ length: 100 }, getMockProduct);
    const searchParams = '?page=2';
    const mockState = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        allProducts: mockProducts,
        allProductsStatus: RequestStatus.Success,
      }),
    });
    const expectedState = getMockFilterState({
      page: 2,
    });
    const mockBrowserHistory = createBrowserHistory();
    const { withStoreComponent, mockStore } = withStore(
      <HistoryRouter history={mockBrowserHistory}>
        <HelmetProvider>
          <CatalogPage />
        </HelmetProvider>
      </HistoryRouter>,
      mockState
    );
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');
    mockBrowserHistory.push(`${AppRoute.Catalog}${searchParams}`);

    render(withStoreComponent);

    expect(dispatchSpy).toBeCalled();
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith(setFilters(expectedState));
  });

  it('should dispatch setFilters when a product price specified in the search parameters', () => {
    const mockProducts = Array.from({ length: 100 }, getMockProduct);
    const minPrice = Math.min(...mockProducts.map((product) => product.price));
    const maxPrice = Math.max(...mockProducts.map((product) => product.price));
    const searchParams = `?price=${minPrice}&priceUp=${maxPrice}`;
    const mockState = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        allProducts: mockProducts,
        allProductsStatus: RequestStatus.Success,
      }),
    });
    const expectedState = getMockFilterState({
      price: minPrice,
      priceUp: maxPrice,
    });
    const mockBrowserHistory = createBrowserHistory();
    const { withStoreComponent, mockStore } = withStore(
      <HistoryRouter history={mockBrowserHistory}>
        <HelmetProvider>
          <CatalogPage />
        </HelmetProvider>
      </HistoryRouter>,
      mockState
    );
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');
    mockBrowserHistory.push(`${AppRoute.Catalog}${searchParams}`);

    render(withStoreComponent);

    expect(dispatchSpy).toBeCalled();
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith(setFilters(expectedState));
  });
});
