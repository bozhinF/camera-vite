import { render, screen, fireEvent } from '@testing-library/react';
import {
  AppRoute,
  ElementRole,
  NameSpace,
  RequestStatus,
} from '../../const/const';
import BasketPage from './basket-page';
import { createMemoryHistory, MemoryHistory } from 'history';
import { withHistory, withStore } from '../../util/mock-component';
import {
  getMockProduct,
  getMockProductsState,
  getMockStore,
} from '../../util/mocks';

describe('Component: BasketPage', () => {
  let mockHistory: MemoryHistory;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders BasketPage correctly', () => {
    const expectedBasketHeading = /Корзина/;
    const mockProductsCount = 3;
    const mockProducts = Array.from({ length: mockProductsCount }, (_, i) =>
      getMockProduct({ id: i + 1, name: `Product ${i + 1}` })
    );
    const mockBasket = mockProducts.map((mockProduct) => mockProduct.id);
    const mockProductsState = getMockProductsState({
      allProducts: mockProducts,
      allProductsStatus: RequestStatus.Success,
      basket: mockBasket,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<BasketPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Basket);

    render(withStoreComponent);

    expect(
      screen.getByRole(ElementRole.Heading, { name: expectedBasketHeading })
    ).toBeInTheDocument();

    mockProducts.forEach(({ name }) =>
      expect(screen.getByText(name)).toBeInTheDocument()
    );
  });

  it('should opens remove item modal when close button is clicked', () => {
    const expectedRemoveButtonText = /удалить товар/i;
    const expectedRemoveItemModalText = /удалить этот товар?/i;
    const mockProduct = getMockProduct({ id: 1, name: 'Product 1' });
    const mockBasket = [1];
    const mockProductsState = getMockProductsState({
      allProducts: [mockProduct],
      allProductsStatus: RequestStatus.Success,
      basket: mockBasket,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<BasketPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Basket);

    render(withStoreComponent);

    const closeButton = screen.getAllByRole(ElementRole.Button, {
      name: expectedRemoveButtonText,
    })[0];
    fireEvent.click(closeButton);
    expect(screen.getByText(expectedRemoveItemModalText)).toBeInTheDocument();
  });

  it('should displays loader when status is loading', () => {
    const loaderTestId = 'loader';
    const mockProductsState = getMockProductsState({
      postOrderStatus: RequestStatus.Loading,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<BasketPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Basket);

    render(withStoreComponent);

    expect(screen.getByTestId(loaderTestId)).toBeInTheDocument();
  });

  it('should displays success modal when status is success', () => {
    const expectedSuccessModalText = /спасибо за покупку/i;
    const mockProductsState = getMockProductsState({
      postOrderStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<BasketPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Basket);

    render(withStoreComponent);

    expect(screen.getByText(expectedSuccessModalText)).toBeInTheDocument();
  });

  it('should displays error modal when status is failed', () => {
    const expectedErrorModalText = /Что-то пошло не так/i;
    const mockProductsState = getMockProductsState({
      postOrderStatus: RequestStatus.Failed,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<BasketPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Basket);

    render(withStoreComponent);

    expect(screen.getByText(expectedErrorModalText)).toBeInTheDocument();
  });

  it('should render empty basket component wher basket is empty', () => {
    const epectedEmptyBasketTitleText = 'Корзина пуста';
    const expectedEmptyBasketText =
      'Воспользуйтесь поиском, чтобы найти всё, что нужно';
    const emptyBasketLinkToMainPageText = 'В каталог';
    const mockStore = getMockStore();
    const withHistoryComponent = withHistory(<BasketPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Basket);

    render(withStoreComponent);

    expect(
      screen.getByRole(ElementRole.Heading, {
        name: epectedEmptyBasketTitleText,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Heading, {
        name: expectedEmptyBasketText,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Link, {
        name: emptyBasketLinkToMainPageText,
      })
    ).toBeInTheDocument();
  });
});
