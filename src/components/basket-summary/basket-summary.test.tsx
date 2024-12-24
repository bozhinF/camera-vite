import { render, screen } from '@testing-library/react';
import { Endpoint, NameSpace, RequestStatus } from '../../const/const';
import { postOrder } from '../../store/products-slice/thunks';
import { discountIncreaser, discountDecreaser } from '../../util/util';
import BasketSummary from './basket-summary';
import { withStore } from '../../util/mock-component';
import {
  extractActionsTypes,
  getMockProduct,
  getMockStore,
} from '../../util/mocks';
import userEvent from '@testing-library/user-event';

describe('Component: BasketSummary', () => {
  it('shold renders correctly', () => {
    const product = getMockProduct();
    const productPrice = `${product.price.toLocaleString('ru')} ₽`;
    const mockStore = getMockStore();
    mockStore[NameSpace.Products].allProducts = [product];
    mockStore[NameSpace.Products].basket = [product.id];
    const { withStoreComponent } = withStore(<BasketSummary />, mockStore);

    render(withStoreComponent);

    const totaPriceElement = screen.getByTestId('total');
    const discountElement = screen.getByTestId('discount');
    const toBePaidElement = screen.getByTestId('paid');
    expect(screen.getByText(/Всего:/i)).toBeInTheDocument();
    expect(screen.getByText(/Скидка:/i)).toBeInTheDocument();
    expect(screen.getByText(/К оплате:/i)).toBeInTheDocument();
    expect(totaPriceElement.textContent).toBe(productPrice);
    expect(discountElement.textContent).toBe('0 ₽');
    expect(toBePaidElement.textContent).toBe(productPrice);
    expect(
      screen.getByRole('button', { name: /Оформить заказ/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Если у вас есть промокод на скидку, примените его в этом поле/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Промокод')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Введите промокод/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Применить' })
    ).toBeInTheDocument();
  });

  it('renders discount and total correctly', () => {
    const product = getMockProduct();
    const productsInBasket = 3;
    const allProuductsPrice = product.price * productsInBasket;
    let discountPercent = 0;
    discountPercent = discountIncreaser(3, discountPercent);
    discountPercent = discountDecreaser(allProuductsPrice, discountPercent);
    const discount = (allProuductsPrice * discountPercent) / 100;
    const total = allProuductsPrice - discount;
    const mockStore = getMockStore();
    mockStore[NameSpace.Products].allProducts = [product];
    mockStore[NameSpace.Products].basket = Array.from(
      { length: productsInBasket },
      () => product.id
    );
    const { withStoreComponent } = withStore(<BasketSummary />, mockStore);

    render(withStoreComponent);

    const totaPriceElement = screen.getByTestId('total');
    const discountElement = screen.getByTestId('discount');
    const toBePaidElement = screen.getByTestId('paid');
    expect(totaPriceElement.textContent).toBe(
      `${allProuductsPrice.toLocaleString('ru')} ₽`
    );
    expect(discountElement.textContent).toBe(
      `${discount.toLocaleString('ru')} ₽`
    );
    expect(discountElement).toHaveClass('basket__summary-value--bonus');
    expect(toBePaidElement.textContent).toBe(`${total.toLocaleString('ru')} ₽`);
  });

  it('shold dispatches postOrder on button click', async () => {
    const product = getMockProduct();
    const fakeStore = getMockStore();
    fakeStore[NameSpace.Products].basket = [product.id];
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      <BasketSummary />,
      fakeStore
    );
    mockAxiosAdapter.onPost(Endpoint.Orders).reply(200, []);

    render(withStoreComponent);
    await userEvent.click(
      screen.getByRole('button', { name: /Оформить заказ/i })
    );
    const actions = extractActionsTypes(mockStore.getActions());

    expect(actions).toEqual([postOrder.pending.type, postOrder.fulfilled.type]);
  });

  it('shold button is disabled if basket is empty', () => {
    const mockStore = getMockStore();
    const { withStoreComponent } = withStore(<BasketSummary />, mockStore);

    render(withStoreComponent);

    const orderButton = screen.getByRole('button', { name: /Оформить заказ/i });
    expect(orderButton).toBeDisabled();
  });

  it('shold button is disabled when order is posting', () => {
    const mockStore = getMockStore();
    mockStore[NameSpace.Products].postOrderStatus = RequestStatus.Loading;
    const { withStoreComponent } = withStore(<BasketSummary />, mockStore);

    render(withStoreComponent);

    const orderButton = screen.getByRole('button', { name: /Оформить заказ/i });
    expect(orderButton).toBeDisabled();
  });
});
