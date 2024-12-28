import { render, screen } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import Layout from './layout';
import { withHistory, withStore } from '../../util/mock-component';
import { AppRoute, NameSpace, RequestStatus } from '../../const/const';
import { getMockProductsState, getMockStore } from '../../util/mocks';
import { Route, Routes } from 'react-router-dom';
import CatalogPage from '../../pages/catalog-page/catalog-page';

describe('Component: Layout', () => {
  let mockHistory: MemoryHistory;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders Header component', () => {
    const withHistoryComponent = withHistory(<Layout />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();
  });

  it('should renders Footer component', () => {
    const withHistoryComponent = withHistory(<Layout />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
  });

  it('should renders Outlet component', () => {
    const productsState = getMockProductsState({
      allProductsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({
      [NameSpace.Products]: productsState,
    });
    const withHistoryComponent = withHistory(
      <Routes>
        <Route path={AppRoute.Catalog} element={<Layout />}>
          <Route path={AppRoute.Catalog} element={<CatalogPage />} />
        </Route>
      </Routes>,
      mockHistory
    );
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    const outletElement = screen.getByRole('main');
    expect(outletElement).toBeInTheDocument();
  });
});
