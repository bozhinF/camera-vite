import { fireEvent, render, screen } from '@testing-library/react';
import {
  getMockProduct,
  getMockProductsState,
  getMockStore,
} from '../../util/mocks';
import { rootReducer } from '../../store/root-reducer';
import { createStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import {
  addItemToBasket,
  removeItemFromBasket,
  updateBasket,
} from '../../store/products-slice/products-slice';
import userEvent from '@testing-library/user-event';
import BasketItem from './basket-item';
import { ElementRole, NameSpace } from '../../const/const';
import { State } from '../../types/state';

describe('Component: BasketItem', () => {
  const onCloseButtonClick = vi.fn();

  const createMockStore = (initialState: State) =>
    createStore(rootReducer, initialState);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders correctly', () => {
    const product = getMockProduct();
    const productsState = getMockProductsState({
      basket: [product.id, product.id],
    });
    const mockStore = getMockStore({ [NameSpace.Products]: productsState });
    const store = createMockStore(mockStore);
    const productName = product.name;
    const productVendorCode = product.vendorCode;
    const productCategory = `${product.type} ${
      product.category === 'Фотоаппарат'
        ? 'фотокамера'
        : product.category.toLowerCase()
    }`;
    const productLevel = `${product.level} уровень`;
    const prevButtonLabel = /уменьшить количество товара/i;
    const nextButtonLabel = /увеличить количество товара/i;
    const closeButtonLabel = /Удалить товар/i;
    const quantityInputTestId = 'quantity';
    const expectedQuantityInputValue = '2';

    render(
      <Provider store={store}>
        <BasketItem
          product={product}
          amount={2}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>
    );

    const quantityInput: HTMLInputElement =
      screen.getByTestId(quantityInputTestId);
    expect(screen.getByText(productName)).toBeInTheDocument();
    expect(screen.getByText(productVendorCode)).toBeInTheDocument();
    expect(screen.getByText(productCategory)).toBeInTheDocument();
    expect(screen.getByText(productLevel)).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: prevButtonLabel })
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: nextButtonLabel })
    ).toBeInTheDocument();
    expect(quantityInput).toBeInTheDocument();
    expect(quantityInput.value).toBe(expectedQuantityInputValue);
    expect(
      screen.getByRole(ElementRole.Button, { name: closeButtonLabel })
    ).toBeInTheDocument();
  });

  it('should calls onCloseButtonClick when close button is clicked', () => {
    const product = getMockProduct();
    const closeButtonLabel = /Удалить товар/i;
    const store = createMockStore(getMockStore());

    render(
      <Provider store={store}>
        <BasketItem
          product={product}
          amount={1}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: closeButtonLabel }));
    expect(onCloseButtonClick).toHaveBeenCalledTimes(1);
  });

  it('should dispatches removeItemFromBasket when prev button is clicked', () => {
    const product = getMockProduct();
    const productsState = getMockProductsState({
      basket: [product.id, product.id],
    });
    const mockStore = getMockStore({ [NameSpace.Products]: productsState });
    const store = createMockStore(mockStore);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const prevButtonLabel = /уменьшить количество товара/i;
    const expectedDispatchCalledTimes = 1;

    render(
      <Provider store={store}>
        <BasketItem
          product={product}
          amount={2}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>
    );

    const prevButton = screen.getByRole(ElementRole.Button, {
      name: prevButtonLabel,
    });
    fireEvent.click(prevButton);
    expect(dispatchSpy).toHaveBeenCalledWith(removeItemFromBasket(product.id));
    expect(dispatchSpy).toHaveBeenCalledTimes(expectedDispatchCalledTimes);
  });

  it('should dispatches addItemToBasket when next button is clicked', () => {
    const product = getMockProduct();
    const productsState = getMockProductsState({
      basket: [product.id, product.id],
    });
    const mockStore = getMockStore({ [NameSpace.Products]: productsState });
    const store = createMockStore(mockStore);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const nextButtonLabel = /увеличить количество товара/i;
    const expectedDispatchCalledTimes = 1;

    render(
      <Provider store={store}>
        <BasketItem
          product={product}
          amount={2}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>
    );

    const nextButton = screen.getByRole(ElementRole.Button, {
      name: nextButtonLabel,
    });
    fireEvent.click(nextButton);
    expect(dispatchSpy).toHaveBeenCalledWith(addItemToBasket(product.id));
    expect(dispatchSpy).toHaveBeenCalledTimes(expectedDispatchCalledTimes);
  });

  it('should dispatches updateBasket when input quantity', async () => {
    const product = getMockProduct();
    const productsState = getMockProductsState({
      basket: [product.id, product.id],
    });
    const mockStore = getMockStore({ [NameSpace.Products]: productsState });
    const store = createMockStore(mockStore);
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const quantityInputTestId = 'quantity';
    const expectedProductQuantity = 5;
    const expectedDispatchCalledTimes = 1;

    render(
      <Provider store={store}>
        <BasketItem
          product={product}
          amount={2}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>
    );

    const quantityInput: HTMLInputElement =
      screen.getByTestId(quantityInputTestId);
    await userEvent.click(quantityInput);
    await userEvent.keyboard(`${expectedProductQuantity}`);
    const expectedBasket = Array.from(
      { length: expectedProductQuantity },
      () => product.id
    );
    expect(dispatchSpy).toHaveBeenCalledWith(updateBasket(expectedBasket));
    expect(dispatchSpy).toHaveBeenCalledTimes(expectedDispatchCalledTimes);
  });

  it('should disabled prev button when quantity equals 1', () => {
    const product = getMockProduct();
    const productsState = getMockProductsState({
      basket: [product.id, product.id],
    });
    const mockStore = getMockStore({ [NameSpace.Products]: productsState });
    const store = createMockStore(mockStore);
    const prevButtonLabel = /уменьшить количество товара/i;

    render(
      <Provider store={store}>
        <BasketItem
          product={product}
          amount={1}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>
    );

    expect(
      screen.getByRole(ElementRole.Button, { name: prevButtonLabel })
    ).toBeDisabled();
  });

  it('should disabled next button when quantity equals 9', () => {
    const product = getMockProduct();
    const productsState = getMockProductsState({
      basket: Array.from({ length: 9 }, () => product.id),
    });
    const mockStore = getMockStore({ [NameSpace.Products]: productsState });
    const store = createMockStore(mockStore);
    const nextButtonLabel = /увеличить количество товара/i;

    render(
      <Provider store={store}>
        <BasketItem
          product={product}
          amount={9}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>
    );

    expect(
      screen.getByRole(ElementRole.Button, { name: nextButtonLabel })
    ).toBeDisabled();
  });
});
