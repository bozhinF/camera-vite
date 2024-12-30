import { createMemoryHistory, MemoryHistory } from 'history';
import { withHistory, withStore } from '../../util/mock-component';
import App from './app';
import {
  getMockProduct,
  getMockProductsState,
  getMockStore,
} from '../../util/mocks';
import { render, screen } from '@testing-library/react';
import { AppRoute, NameSpace, RequestStatus } from '../../const/const';

describe('Application Routing', () => {
  type WindowScrollTo = (options?: ScrollToOptions) => void;
  let mockHistory: MemoryHistory;

  beforeAll(() => {
    window.scrollTo = vi.fn() as unknown as WindowScrollTo;
  });

  beforeEach(() => {
    mockHistory = createMemoryHistory();
  });

  it('should render "CatalogPage" when user navigate to "/"', () => {
    const expectedText = /Каталог фото- и видеотехники/i;
    const productsState = getMockProductsState({
      allProductsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({
      [NameSpace.Products]: productsState,
    });
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('should render "CatalogPage" when user navigate to "/catalog"', () => {
    const expectedText = /Каталог фото- и видеотехники/i;
    const productsState = getMockProductsState({
      allProductsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({
      [NameSpace.Products]: productsState,
    });
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });

  it('should render "BasketPage" when user navigate to "/catalog/basket"', () => {
    const basketText = /Корзина/i;
    const expectedCountBasketTextOnBasketPage = 2;
    const promotionalСodeText =
      /Если у вас есть промокод на скидку, примените его в этом поле/i;
    const enterPromotionalCodeText = /Введите промокод/i;
    const applyText = /Применить/i;
    const totalText = /Всего:/i;
    const discountText = /Скидка:/i;
    const toPayText = /К оплате:/i;
    const placeOrderText = /Оформить заказ/i;
    const mockStore = getMockStore();
    mockStore[NameSpace.Products].basket = [1];
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Basket);

    render(withStoreComponent);

    expect(screen.getAllByText(basketText)).toHaveLength(
      expectedCountBasketTextOnBasketPage
    );
    expect(screen.getByText(promotionalСodeText)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(enterPromotionalCodeText)
    ).toBeInTheDocument();
    expect(screen.getByText(applyText)).toBeInTheDocument();
    expect(screen.getByText(totalText)).toBeInTheDocument();
    expect(screen.getByText(discountText)).toBeInTheDocument();
    expect(screen.getByText(toPayText)).toBeInTheDocument();
    expect(screen.getByText(placeOrderText)).toBeInTheDocument();
  });

  it('should render "ProductPage" when user navigate to "/catalog/product/:id"', () => {
    const addToBasketText = /Добавить в корзину/i;
    const characteristicsText = /Характеристики/i;
    const descriptionText = /Описание/i;
    const expectedCountProductNameTextInPage = 2;
    const product = getMockProduct();
    const mockProductsState = getMockProductsState({
      productDetails: product,
      productDetailsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({
      [NameSpace.Products]: mockProductsState,
    });
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(`${AppRoute.Product.replace(':id', String(product.id))}`);

    render(withStoreComponent);

    expect(screen.getAllByText(product.name)).toHaveLength(
      expectedCountProductNameTextInPage
    );
    expect(screen.getByText(addToBasketText)).toBeInTheDocument();
    expect(screen.getByText(characteristicsText)).toBeInTheDocument();
    expect(screen.getByText(descriptionText)).toBeInTheDocument();
  });

  it('should render "NotFoundPage" when user navigate to non-existent route', () => {
    const pageNotFoundText = /404: Page Not Found/i;
    const goToMainPageText = /Go to Main page/i;
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    const unknownRoute = '/unknown-route';
    mockHistory.push(unknownRoute);

    render(withStoreComponent);

    expect(screen.getByText(pageNotFoundText)).toBeInTheDocument();
    expect(screen.getByText(goToMainPageText)).toBeInTheDocument();
  });
});
