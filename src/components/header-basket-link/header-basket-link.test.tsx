import { render, screen } from '@testing-library/react';
import { AppRoute, NameSpace } from '../../const/const';
import { createMemoryHistory, MemoryHistory } from 'history';
import HeaderBasketLink from './header-basket-link';
import { withHistory, withStore } from '../../util/mock-component';
import { getMockStore } from '../../util/mocks';

describe('Component: HeaderBasketLink', () => {
  let mockHistory: MemoryHistory;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders basket link', () => {
    const withHistoryComponent = withHistory(<HeaderBasketLink />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const basketLink = screen.getByTestId('basket-link');
    expect(basketLink).toBeInTheDocument();
    expect(basketLink).toHaveAttribute('href', AppRoute.Basket);
  });

  it('should renders basket count when there are items', () => {
    const mockStore = getMockStore();
    mockStore[NameSpace.Products].basket = [1, 2, 2];
    const withHistoryComponent = withHistory(<HeaderBasketLink />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const basketCount = screen.getByText('3');
    expect(basketCount).toBeInTheDocument();
  });

  it('should does not render basket count when basket is empty', () => {
    const withHistoryComponent = withHistory(<HeaderBasketLink />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const basketCount = screen.queryByText(/^\d+$/);
    expect(basketCount).not.toBeInTheDocument();
  });
});
