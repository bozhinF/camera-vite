import { fireEvent, render, screen } from '@testing-library/react';
import { getMockProduct, getMockStore } from '../../util/mocks';
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
import { NameSpace, RequestStatus } from '../../const/const';

describe('Component: BasketItem', () => {
  const initialProductsState = {
    allProductsStatus: RequestStatus.Idle,
    allProducts: [],
    productDetailsStatus: RequestStatus.Idle,
    productDetails: null,
    productReviewsStatus: RequestStatus.Idle,
    productReviews: [],
    basket: [],
    postOrderStatus: RequestStatus.Idle,
  };
  const onCloseButtonClick = vi.fn();

  const createMockStore = (initialState: ReturnType<typeof getMockStore>) =>
    createStore(rootReducer, initialState);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders correctly', () => {
    const product = getMockProduct();
    const productsState = {
      ...initialProductsState,
      basket: [product.id, product.id],
    };
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

    render(
      <Provider store={store}>
        <BasketItem
          product={product}
          amount={2}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>
    );

    const quantityInput: HTMLInputElement = screen.getByTestId('quantity');
    expect(screen.getByText(productName)).toBeInTheDocument();
    expect(screen.getByText(productVendorCode)).toBeInTheDocument();
    expect(screen.getByText(productCategory)).toBeInTheDocument();
    expect(screen.getByText(productLevel)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: prevButtonLabel })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: nextButtonLabel })
    ).toBeInTheDocument();
    expect(quantityInput).toBeInTheDocument();
    expect(quantityInput.value).toBe('2');
    expect(
      screen.getByRole('button', { name: closeButtonLabel })
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
    const productsState = {
      ...initialProductsState,
      basket: [product.id, product.id],
    };
    const mockStore = getMockStore({ [NameSpace.Products]: productsState });
    const store = createMockStore(mockStore);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const prevButtonLabel = /уменьшить количество товара/i;

    render(
      <Provider store={store}>
        <BasketItem
          product={product}
          amount={2}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>
    );

    const prevButton = screen.getByRole('button', {
      name: prevButtonLabel,
    });
    fireEvent.click(prevButton);
    expect(dispatchSpy).toHaveBeenCalledWith(removeItemFromBasket(product.id));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispatches addItemToBasket when next button is clicked', () => {
    const product = getMockProduct();
    const productsState = {
      ...initialProductsState,
      basket: [product.id, product.id],
    };
    const mockStore = getMockStore({ [NameSpace.Products]: productsState });
    const store = createMockStore(mockStore);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    const nextButtonLabel = /увеличить количество товара/i;

    render(
      <Provider store={store}>
        <BasketItem
          product={product}
          amount={2}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>
    );

    const nextButton = screen.getByRole('button', {
      name: nextButtonLabel,
    });
    fireEvent.click(nextButton);
    expect(dispatchSpy).toHaveBeenCalledWith(addItemToBasket(product.id));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should dispatches updateBasket when input quantity', async () => {
    const product = getMockProduct();
    const productsState = {
      ...initialProductsState,
      basket: [product.id, product.id],
    };
    const mockStore = getMockStore({ [NameSpace.Products]: productsState });
    const store = createMockStore(mockStore);
    const dispatchSpy = vi.spyOn(store, 'dispatch');

    render(
      <Provider store={store}>
        <BasketItem
          product={product}
          amount={2}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>
    );

    const quantityInput: HTMLInputElement = screen.getByTestId('quantity');
    await userEvent.click(quantityInput);
    await userEvent.keyboard('5');
    const expectedBasket = Array.from({ length: 5 }, () => product.id);
    expect(dispatchSpy).toHaveBeenCalledWith(updateBasket(expectedBasket));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should disabled prev button when quantity equals 1', () => {
    const product = getMockProduct();
    const productsState = {
      ...initialProductsState,
      basket: [product.id],
    };
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
      screen.getByRole('button', { name: prevButtonLabel })
    ).toBeDisabled();
  });

  it('should disabled next button when quantity equals 9', () => {
    const product = getMockProduct();
    const productsState = {
      ...initialProductsState,
      basket: Array.from({ length: 9 }, () => product.id),
    };
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
      screen.getByRole('button', { name: nextButtonLabel })
    ).toBeDisabled();
  });
});
