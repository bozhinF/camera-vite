import { fireEvent, render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../util/mock-component';
import { getMockProduct, getMockStore } from '../../util/mocks';
import AddItemModal from './add-item-modal';
import { createMemoryHistory } from 'history';
import { rootReducer } from '../../store/root-reducer';
import { createStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { addItemToBasket } from '../../store/products-slice/products-slice';
import userEvent from '@testing-library/user-event';
import { ElementRole, UserEventKey } from '../../const/const';

describe('Component: AddItemModal', () => {
  type MockStore = ReturnType<typeof getMockStore>;

  const mockAddItem = getMockProduct();
  const onCloseButtonClick = vi.fn();
  const onBuyButtonClick = vi.fn();

  const createMockStore = (initialState: MockStore) =>
    createStore(rootReducer, initialState);

  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = createMockStore(getMockStore());
  });

  it('should renders correctly with a product', () => {
    const title = /Добавить товар в корзину/i;
    const productName = mockAddItem.name;
    const buyButtonText = /Добавить в корзину/i;
    const closeButtonLabel = /Закрыть попап/i;

    render(
      <Provider store={store}>
        <AddItemModal
          addItem={mockAddItem}
          onCloseButtonClick={onCloseButtonClick}
          onBuyButtonClick={onBuyButtonClick}
        />
      </Provider>
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(productName)).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: buyButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: closeButtonLabel })
    ).toBeInTheDocument();
  });

  it('should calls onCloseButtonClick when close button is clicked', () => {
    const closeButtonLabel = /Закрыть попап/i;

    render(
      <Provider store={store}>
        <AddItemModal
          addItem={mockAddItem}
          onCloseButtonClick={onCloseButtonClick}
          onBuyButtonClick={onBuyButtonClick}
        />
      </Provider>
    );

    fireEvent.click(
      screen.getByRole(ElementRole.Button, { name: closeButtonLabel })
    );
    expect(onCloseButtonClick).toHaveBeenCalledTimes(1);
  });

  it('should dispatches addItemToBasket and calls onBuyButtonClick when buy button is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const buyButtonText = /Добавить в корзину/i;
    const expectedDispatchCalledTimes = 1;
    const expectedOnBuyButtonClickCalledTimes = 1;

    render(
      <Provider store={store}>
        <AddItemModal
          addItem={mockAddItem}
          onCloseButtonClick={onCloseButtonClick}
          onBuyButtonClick={onBuyButtonClick}
        />
      </Provider>
    );

    const buyButton = screen.getByRole(ElementRole.Button, {
      name: buyButtonText,
    });
    fireEvent.click(buyButton);
    expect(dispatchSpy).toHaveBeenCalledWith(addItemToBasket(mockAddItem.id));
    expect(dispatchSpy).toHaveBeenCalledTimes(expectedDispatchCalledTimes);
    expect(onBuyButtonClick).toHaveBeenCalledTimes(
      expectedOnBuyButtonClickCalledTimes
    );
  });

  it('should handles keyboard navigation between buttons', async () => {
    const buyButtonText = /Добавить в корзину/i;
    const closeButtonLabel = /Закрыть попап/i;

    render(
      <Provider store={store}>
        <AddItemModal
          addItem={mockAddItem}
          onCloseButtonClick={onCloseButtonClick}
          onBuyButtonClick={onBuyButtonClick}
        />
      </Provider>
    );

    const closeButton = screen.getByRole(ElementRole.Button, {
      name: closeButtonLabel,
    });
    const buyButton = screen.getByRole(ElementRole.Button, {
      name: buyButtonText,
    });

    expect(document.activeElement).toBe(buyButton);

    await userEvent.keyboard(UserEventKey.Tab);
    expect(document.activeElement).toBe(closeButton);

    await userEvent.keyboard(UserEventKey.ShiftTab);
    expect(document.activeElement).toBe(buyButton);
  });

  it('should renders SomethingWrongModal when addItem is null', () => {
    const somethingWrongModalText = /Что-то пошло не так/i;
    const mockHistory = createMemoryHistory();
    const withHistoryComponent = withHistory(
      <AddItemModal
        addItem={null}
        onCloseButtonClick={onCloseButtonClick}
        onBuyButtonClick={onBuyButtonClick}
      />,
      mockHistory
    );
    const { withStoreComponent } = withStore(withHistoryComponent, {});

    render(withStoreComponent);

    expect(screen.getByText(somethingWrongModalText)).toBeInTheDocument();
  });
});
