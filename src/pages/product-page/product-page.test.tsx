import { render, screen, fireEvent } from '@testing-library/react';
import {
  AppRoute,
  Crumb,
  ElementAttribute,
  ElementRole,
  NameSpace,
  RequestStatus,
} from '../../const/const';
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
import HistoryRouter from '../../components/history-router/history-router';
import { HelmetProvider } from 'react-helmet-async';
import { setFilters } from '../../store/filter-slice/filter-slice';

describe('Component: ProductPage', () => {
  type WindowScrollTo = (options?: ScrollToOptions) => void;
  let mockHistory: MemoryHistory;

  beforeAll(() => {
    window.scrollTo = vi.fn() as unknown as WindowScrollTo;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders breadcrumbs', () => {
    const breadcrumbsTipTestId = 'breadcrumbs-tip';
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

    expect(
      screen.getByRole(ElementRole.Link, { name: Crumb.Main })
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Link, { name: Crumb.Catalog })
    ).toBeInTheDocument();
    expect(screen.getByTestId(breadcrumbsTipTestId)).toBeInTheDocument();
    expect(screen.getByTestId(breadcrumbsTipTestId).textContent).toBe(
      expectedProductName
    );
  });

  it('should renders product image', () => {
    const pictureTestId = 'picture';
    const sourceTestId = 'source';
    const imageTestId = 'image';
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

    expect(screen.getByTestId(pictureTestId)).toBeInTheDocument();
    expect(screen.getByTestId(sourceTestId)).toBeInTheDocument();
    expect(screen.getByTestId(imageTestId)).toBeInTheDocument();
  });

  it('should renders product details', () => {
    const starTestId = 'star';
    const expectedStarsCount = 5;
    const starImageTestId = 'star-image';
    const expectedFullStarXlinkHref = '#icon-full-star';
    const expectedEmptyStarXlinkHref = '#icon-star';
    const expectedCharacteristicsTabText = 'Характеристики';
    const expectedDescriptionTabText = 'Описание';
    const activeTabClass = 'is-active';
    const expectedVendorCodeTitleText = 'Артикул:';
    const expectedCategoryTitleText = 'Категория:';
    const expectedTypeTitleText = 'Тип камеры:';
    const expectedLevelTitleText = 'Уровень:';
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
      screen.getByRole(ElementRole.Heading, { name: expectedProductName })
    ).toBeInTheDocument();
    expect(screen.getAllByTestId(starTestId)).toHaveLength(expectedStarsCount);
    const starsImage = screen.getAllByTestId(starImageTestId);
    starsImage.forEach((starImage, index) =>
      expect(starImage.getAttribute(ElementAttribute.XlinkHref)).toBe(
        index < mockProduct.rating
          ? expectedFullStarXlinkHref
          : expectedEmptyStarXlinkHref
      )
    );
    expect(screen.getByText(expectedProductPrice)).toBeInTheDocument();
    expect(
      screen.getByText(expectedCharacteristicsTabText)
    ).toBeInTheDocument();
    expect(screen.getByText(expectedDescriptionTabText)).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, {
        name: expectedCharacteristicsTabText,
      })
    ).toHaveClass(activeTabClass);
    expect(
      screen.getByRole(ElementRole.Button, { name: expectedDescriptionTabText })
    ).not.toHaveClass(activeTabClass);
    expect(screen.getByText(expectedVendorCodeTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.vendorCode)).toBeInTheDocument();
    expect(screen.getByText(expectedCategoryTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText(expectedTypeTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.type)).toBeInTheDocument();
    expect(screen.getByText(expectedLevelTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.level)).toBeInTheDocument();
  });

  it('should renders product reviews', () => {
    const expectedReviewsTitle = 'Отзывы';
    const reviewItemTestId = 'review-item';
    const expectedShowMoreButtonText = 'Показать больше отзывов';
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

    expect(screen.getByText(expectedReviewsTitle)).toBeInTheDocument();
    expect(screen.getAllByTestId(reviewItemTestId)).toHaveLength(
      expectedShowedReviewsCount
    );
    expect(
      screen.getByRole(ElementRole.Button, {
        name: expectedShowMoreButtonText,
      })
    ).toBeInTheDocument();
  });

  it('should shows modal when add button is clicked', () => {
    const expectedAddButtonText = 'Добавить в корзину';
    const expectedAddModalTitleText = 'Добавить товар в корзину';
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

    const addButton = screen.getByRole(ElementRole.Button, {
      name: expectedAddButtonText,
    });
    expect(addButton).toBeInTheDocument();
    fireEvent.click(addButton);
    expect(screen.getByText(expectedAddModalTitleText)).toBeInTheDocument();
  });

  it('should render up button and scroll to top when is clicked', () => {
    const upButtonTextId = 'up-btn';
    const expectedWindowScrollToProps = {
      top: 0,
      left: 0,
      behavior: 'smooth',
    };
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

    const upButton = screen.getByTestId(upButtonTextId);
    fireEvent.click(upButton);
    expect(window.scrollTo).toHaveBeenCalledWith(expectedWindowScrollToProps);
  });

  it('should render loader when productDetailsStatus is loadig', () => {
    const expectedLodingText = 'Loading...';
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

    expect(screen.getByText(expectedLodingText)).toBeInTheDocument();
  });

  it('should render loader when productDetailsStatus is idle', () => {
    const expectedLodingText = 'Loading...';
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

    expect(screen.getByText(expectedLodingText)).toBeInTheDocument();
  });

  it('should render a not found page if there is no product details', () => {
    const expectedNotFoundPageText = '404: Page Not Found';
    const mockStore = getMockStore({
      [NameSpace.Products]: getMockProductsState({
        productDetailsStatus: RequestStatus.Failed,
      }),
    });
    const withHistoryComponent = withHistory(<ProductPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Product);

    render(withStoreComponent);

    expect(screen.getByText(expectedNotFoundPageText)).toBeInTheDocument();
  });

  it('should dispatch setFilters when specified search parameters', () => {
    const searchParams = '?tab=description';
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
      `${AppRoute.Product.replace(
        ':id',
        String(mockProduct.id)
      )}${searchParams}`
    );

    render(withStoreComponent);

    expect(dispatchSpy).toBeCalled();
    expect(dispatchSpy).toBeCalledTimes(1);
    expect(dispatchSpy).toBeCalledWith(setFilters(expectedState));
  });
});
