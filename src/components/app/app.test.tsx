import { createMemoryHistory, MemoryHistory } from 'history';
import { withHistory, withStore } from '../../util/mock-component';
import App from './app';
import { getMockProduct, getMockStore } from '../../util/mocks';
import { render, screen } from '@testing-library/react';
import { AppRoute, NameSpace, RequestStatus } from '../../const/const';

describe('Application Routing', () => {
  let mockHistory: MemoryHistory;

  beforeAll(() => {
    window.scrollTo = vi.fn() as unknown as (options?: ScrollToOptions) => void;
  });

  beforeEach(() => {
    mockHistory = createMemoryHistory();
  });

  it('should render "CatalogPage" when user navigate to "/"', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    expect(
      screen.getByText(/Каталог фото- и видеотехники/i)
    ).toBeInTheDocument();
  });

  it('should render "CatalogPage" when user navigate to "/catalog"', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    expect(
      screen.getByText(/Каталог фото- и видеотехники/i)
    ).toBeInTheDocument();
  });

  it('should render "BasketPage" when user navigate to "/catalog/basket"', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Basket);

    render(withStoreComponent);

    expect(screen.getAllByText(/Корзина/i)).toHaveLength(2);
    expect(
      screen.getByText(
        /Если у вас есть промокод на скидку, примените его в этом поле/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Введите промокод/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Применить/i)).toBeInTheDocument();
    expect(screen.getByText(/Всего:/i)).toBeInTheDocument();
    expect(screen.getByText(/Скидка:/i)).toBeInTheDocument();
    expect(screen.getByText(/К оплате:/i)).toBeInTheDocument();
    expect(screen.getByText(/Оформить заказ/i)).toBeInTheDocument();
  });

  it('should render "ProductPage" when user navigate to "/catalog/product/:id"', () => {
    const product = getMockProduct();
    const productName = product.name;
    const id = product.id;
    const mockStore = getMockStore();
    mockStore[NameSpace.Products].productDetails = product;
    mockStore[NameSpace.Products].productDetailsStatus = RequestStatus.Success;
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(`${AppRoute.Product.replace(':id', String(id))}`);

    render(withStoreComponent);

    expect(screen.getAllByText(productName)).toHaveLength(2);
    expect(screen.getByText(/Добавить в корзину/i)).toBeInTheDocument();
    expect(screen.getByText(/Характеристики/i)).toBeInTheDocument();
    expect(screen.getByText(/Описание/i)).toBeInTheDocument();
  });

  it('should render "NotFoundPage" when user navigate to non-existent route', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    const unknownRoute = '/unknown-route';
    mockHistory.push(unknownRoute);

    render(withStoreComponent);

    expect(screen.getByText('404: Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Go to Main page')).toBeInTheDocument();
  });
});
