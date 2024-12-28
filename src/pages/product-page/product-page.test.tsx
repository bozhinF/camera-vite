import { render, screen, fireEvent } from '@testing-library/react';
import { AppRoute, Crumb, NameSpace, RequestStatus } from '../../const/const';
import {
  createBrowserHistory,
  createMemoryHistory,
  MemoryHistory,
} from 'history';
import { withHistory, withStore } from '../../util/mock-component';
import {
  getMockProduct,
  getMockProductsState,
  getMockReview,
  getMockStore,
} from '../../util/mocks';
import ProductPage from './product-page';
import { divideNumberByPieces } from '../../util/util';
import HistoryRouter from '../../components/history-route/history-route';
import { HelmetProvider } from 'react-helmet-async';
import { setFilters } from '../../store/filter-slice/filter-slice';

describe('Component: ProductPage', () => {
  let mockHistory: MemoryHistory;

  beforeAll(() => {
    window.scrollTo = vi.fn() as unknown as (options?: ScrollToOptions) => void;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders breadcrumbs', () => {
    const mockProduct = getMockProduct();
    const expectedProductName = mockProduct.name;
    const mockStore = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        productDetails: mockProduct,
        productDetailsStatus: RequestStatus.Success,
      }),
    });
    const withHistoryComponent = withHistory(<ProductPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Product.replace(':id', String(mockProduct.id)));

    render(withStoreComponent);

    expect(screen.getByRole('link', { name: Crumb.Main })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: Crumb.Catalog })
    ).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs-tip')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs-tip').textContent).toBe(
      expectedProductName
    );
  });

  it('should renders product image', () => {
    const mockProduct = getMockProduct();
    const mockStore = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        productDetails: mockProduct,
        productDetailsStatus: RequestStatus.Success,
      }),
    });
    const withHistoryComponent = withHistory(<ProductPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Product.replace(':id', String(mockProduct.id)));

    render(withStoreComponent);

    expect(screen.getByTestId('picture')).toBeInTheDocument();
    expect(screen.getByTestId('source')).toBeInTheDocument();
    expect(screen.getByTestId('image')).toBeInTheDocument();
  });

  it('should renders product details', () => {
    const mockProduct = getMockProduct();
    const expectedProductName = mockProduct.name;
    const expectedProductPrice = `${divideNumberByPieces(mockProduct.price)} ₽`;
    const mockStore = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        productDetails: mockProduct,
        productDetailsStatus: RequestStatus.Success,
      }),
    });
    const withHistoryComponent = withHistory(<ProductPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Product.replace(':id', String(mockProduct.id)));

    render(withStoreComponent);

    expect(
      screen.getByRole('heading', { name: expectedProductName })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId('star')).toHaveLength(5);
    const starsImage = screen.getAllByTestId('star-image');
    starsImage.forEach((starImage, index) =>
      expect(starImage.getAttribute('xlink:href')).toBe(
        index < mockProduct.rating ? '#icon-full-star' : '#icon-star'
      )
    );
    expect(screen.getByText(expectedProductPrice)).toBeInTheDocument();
    expect(screen.getByText('Характеристики')).toBeInTheDocument();
    expect(screen.getByText('Описание')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Характеристики' })).toHaveClass(
      'is-active'
    );
    expect(screen.getByRole('button', { name: 'Описание' })).not.toHaveClass(
      'is-active'
    );
    expect(screen.getByText('Артикул:')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.vendorCode)).toBeInTheDocument();
    expect(screen.getByText('Категория:')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText('Тип камеры:')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.type)).toBeInTheDocument();
    expect(screen.getByText('Уровень:')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.level)).toBeInTheDocument();
  });

  it('should renders product reviews', () => {
    const mockProduct = getMockProduct();
    const mockReviews = Array.from({ length: 5 }, getMockReview);
    const expectedShowedReviewsCount = 3;
    const mockStore = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        productDetails: mockProduct,
        productDetailsStatus: RequestStatus.Success,
        productReviews: mockReviews,
        productReviewsStatus: RequestStatus.Success,
      }),
    });
    const withHistoryComponent = withHistory(<ProductPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Product.replace(':id', String(mockProduct.id)));

    render(withStoreComponent);

    expect(screen.getByText('Отзывы')).toBeInTheDocument();
    expect(screen.getAllByTestId('review-item')).toHaveLength(
      expectedShowedReviewsCount
    );
    expect(
      screen.getByRole('button', {
        name: /Показать больше отзывов/i,
      })
    ).toBeInTheDocument();
  });

  it('should shows modal when add button is clicked', () => {
    const mockProduct = getMockProduct();
    const mockStore = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        productDetails: mockProduct,
        productDetailsStatus: RequestStatus.Success,
      }),
    });
    const withHistoryComponent = withHistory(<ProductPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Product.replace(':id', String(mockProduct.id)));

    render(withStoreComponent);

    const addButton = screen.getByRole('button', {
      name: /Добавить в корзину/i,
    });
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);

    expect(screen.getByText('Добавить товар в корзину')).toBeInTheDocument();
  });

  it('should render up button and scroll to top when is clicked', () => {
    const mockProduct = getMockProduct();
    const mockStore = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        productDetails: mockProduct,
        productDetailsStatus: RequestStatus.Success,
      }),
    });
    const withHistoryComponent = withHistory(<ProductPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Product.replace(':id', String(mockProduct.id)));

    render(withStoreComponent);

    const upButton = screen.getByTestId('up-btn');
    fireEvent.click(upButton);

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  });

  it('should render loader when productDetailsStatus is loadig', () => {
    const mockProduct = getMockProduct();
    const mockStore = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        productDetailsStatus: RequestStatus.Loading,
      }),
    });
    const withHistoryComponent = withHistory(<ProductPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Product.replace(':id', String(mockProduct.id)));

    render(withStoreComponent);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render loader when productDetailsStatus is idle', () => {
    const mockProduct = getMockProduct();
    const mockStore = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        productDetailsStatus: RequestStatus.Idle,
      }),
    });
    const withHistoryComponent = withHistory(<ProductPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Product.replace(':id', String(mockProduct.id)));

    render(withStoreComponent);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render a not found page if there is no product details', () => {
    const mockStore = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        productDetailsStatus: RequestStatus.Failed,
      }),
    });
    const withHistoryComponent = withHistory(<ProductPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Product);

    render(withStoreComponent);

    expect(screen.getByText('404: Page Not Found')).toBeInTheDocument();
  });

  it('should dispatch setFilters when specified search parameters', () => {
    const mockProduct = getMockProduct({ id: 1 });
    const mockState = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        productDetails: mockProduct,
        productDetailsStatus: RequestStatus.Success,
      }),
    });
    const expectedState = { ...mockState.FILTER, tab: 'description' };
    const mockBrowserHistory = createBrowserHistory();
    const { withStoreComponent, mockStore } = withStore(
      <HistoryRouter history={mockBrowserHistory}>
        <HelmetProvider>
          <ProductPage />
        </HelmetProvider>
      </HistoryRouter>,
      mockState
    );
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');
    mockBrowserHistory.push(
      `${AppRoute.Product.replace(':id', '1')}?tab=description`
    );

    render(withStoreComponent);

    expect(dispatchSpy).toBeCalled();
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith(setFilters(expectedState));
  });
});
