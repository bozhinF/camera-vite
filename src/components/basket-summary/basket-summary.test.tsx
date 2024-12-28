import { render, screen } from '@testing-library/react';
import {
  ElementRole,
  Endpoint,
  NameSpace,
  RequestStatus,
} from '../../const/const';
import { postOrder } from '../../store/products-slice/thunks';
import { discountIncreaser, discountDecreaser } from '../../util/util';
import BasketSummary from './basket-summary';
import { withStore } from '../../util/mock-component';
import {
  extractActionsTypes,
  getMockProduct,
  getMockProductsState,
  getMockStore,
} from '../../util/mocks';
import userEvent from '@testing-library/user-event';

describe('Component: BasketSummary', () => {
  it('should renders correctly', () => {
    const product = getMockProduct();
    const productPrice = `${product.price.toLocaleString('ru')} ₽`;
    const productsState = getMockProductsState({
      allProducts: [product],
      basket: [product.id],
    });
    const mockStore = getMockStore({ [NameSpace.Products]: productsState });
    const { withStoreComponent } = withStore(<BasketSummary />, mockStore);
    const totalPriceElementTestId = 'total';
    const discountElementTestId = 'discount';
    const toBePaidElementTestId = 'paid';
    const totalText = /Всего:/i;
    const discountText = /Скидка:/i;
    const toPayText = /К оплате:/i;
    const expectedDiscountElementTextContent = '0 ₽';
    const placeOrderButtonText = /Оформить заказ/i;
    const applyPromoText =
      /Если у вас есть промокод на скидку, примените его в этом поле/i;
    const promoText = 'Промокод';
    const enterPromoText = /Введите промокод/i;
    const applyButtonText = 'Применить';

    render(withStoreComponent);

    const totalPriceElement = screen.getByTestId(totalPriceElementTestId);
    const discountElement = screen.getByTestId(discountElementTestId);
    const toBePaidElement = screen.getByTestId(toBePaidElementTestId);
    expect(screen.getByText(totalText)).toBeInTheDocument();
    expect(screen.getByText(discountText)).toBeInTheDocument();
    expect(screen.getByText(toPayText)).toBeInTheDocument();
    expect(totalPriceElement.textContent).toBe(productPrice);
    expect(discountElement.textContent).toBe(
      expectedDiscountElementTextContent
    );
    expect(toBePaidElement.textContent).toBe(productPrice);
    expect(
      screen.getByRole(ElementRole.Button, { name: placeOrderButtonText })
    ).toBeInTheDocument();
    expect(screen.getByText(applyPromoText)).toBeInTheDocument();
    expect(screen.getByText(promoText)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(enterPromoText)).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: applyButtonText })
    ).toBeInTheDocument();
  });

  it('should renders discount and total correctly', () => {
    const product = getMockProduct();
    const productsInBasket = 3;
    const allProuductsPrice = product.price * productsInBasket;
    let discountPercent = 0;
    discountPercent = discountIncreaser(3, discountPercent);
    discountPercent = discountDecreaser(allProuductsPrice, discountPercent);
    const discount = (allProuductsPrice * discountPercent) / 100;
    const total = allProuductsPrice - discount;
    const productsState = getMockProductsState({
      allProducts: [product],
      basket: Array.from({ length: productsInBasket }, () => product.id),
    });
    const mockStore = getMockStore({ [NameSpace.Products]: productsState });
    const { withStoreComponent } = withStore(<BasketSummary />, mockStore);
    const totalPriceElementTestId = 'total';
    const discountElementTestId = 'discount';
    const toBePaidElementTestId = 'paid';
    const expectedTotalPriceTextContent = `${allProuductsPrice.toLocaleString(
      'ru'
    )} ₽`;
    const expectedDiscountElementTextContent = `${discount.toLocaleString(
      'ru'
    )} ₽`;
    const expectedDiscountElementClass = 'basket__summary-value--bonus';
    const expectedToBePaidTextContent = `${total.toLocaleString('ru')} ₽`;

    render(withStoreComponent);

    const totaPriceElement = screen.getByTestId(totalPriceElementTestId);
    const discountElement = screen.getByTestId(discountElementTestId);
    const toBePaidElement = screen.getByTestId(toBePaidElementTestId);
    expect(totaPriceElement.textContent).toBe(expectedTotalPriceTextContent);
    expect(discountElement.textContent).toBe(
      expectedDiscountElementTextContent
    );
    expect(discountElement).toHaveClass(expectedDiscountElementClass);
    expect(toBePaidElement.textContent).toBe(expectedToBePaidTextContent);
  });

  it('should dispatches postOrder on button click', async () => {
    const product = getMockProduct();
    const fakeStore = getMockStore();
    fakeStore[NameSpace.Products].basket = [product.id];
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      <BasketSummary />,
      fakeStore
    );
    mockAxiosAdapter.onPost(Endpoint.Orders).reply(200, []);
    const placeOrderButtonText = /Оформить заказ/i;

    render(withStoreComponent);

    await userEvent.click(
      screen.getByRole(ElementRole.Button, { name: placeOrderButtonText })
    );
    const actions = extractActionsTypes(mockStore.getActions());
    expect(actions).toEqual([postOrder.pending.type, postOrder.fulfilled.type]);
  });

  it('should button is disabled if basket is empty', () => {
    const mockStore = getMockStore();
    const { withStoreComponent } = withStore(<BasketSummary />, mockStore);
    const placeOrderButtonText = /Оформить заказ/i;

    render(withStoreComponent);

    const orderButton = screen.getByRole(ElementRole.Button, {
      name: placeOrderButtonText,
    });
    expect(orderButton).toBeDisabled();
  });

  it('should button is disabled when order is posting', () => {
    const mockStore = getMockStore();
    mockStore[NameSpace.Products].postOrderStatus = RequestStatus.Loading;
    const { withStoreComponent } = withStore(<BasketSummary />, mockStore);
    const placeOrderButtonText = /Оформить заказ/i;

    render(withStoreComponent);

    const orderButton = screen.getByRole(ElementRole.Button, {
      name: placeOrderButtonText,
    });
    expect(orderButton).toBeDisabled();
  });
});
