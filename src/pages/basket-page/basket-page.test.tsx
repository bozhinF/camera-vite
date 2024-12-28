import { render, screen, fireEvent } from '@testing-library/react';
import { AppRoute, NameSpace, RequestStatus } from '../../const/const';
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
    const mockProducts = Array.from({ length: 3 }, (_, i) =>
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
      screen.getByRole('heading', { name: /Корзина/ })
    ).toBeInTheDocument();

    mockProducts.forEach(({ name }) =>
      expect(screen.getByText(name)).toBeInTheDocument()
    );
  });

  it('should opens remove item modal when close button is clicked', () => {
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

    const closeButton = screen.getAllByRole('button', {
      name: /удалить товар/i,
    })[0];
    fireEvent.click(closeButton);
    expect(screen.getByText(/удалить этот товар?/i)).toBeInTheDocument();
  });

  it('should displays loader when status is loading', () => {
    const mockProductsState = getMockProductsState({
      postOrderStatus: RequestStatus.Loading,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<BasketPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Basket);

    render(withStoreComponent);

    expect(screen.getByTestId(/loader/i)).toBeInTheDocument();
  });

  it('should displays success modal when status is success', () => {
    const mockProductsState = getMockProductsState({
      postOrderStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<BasketPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Basket);

    render(withStoreComponent);

    expect(screen.getByText(/спасибо за покупку/i)).toBeInTheDocument();
  });

  it('should displays error modal when status is failed', () => {
    const mockProductsState = getMockProductsState({
      postOrderStatus: RequestStatus.Failed,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(<BasketPage />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Basket);

    render(withStoreComponent);

    expect(screen.getByText(/Что-то пошло не так/i)).toBeInTheDocument();
  });
});
