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

describe('Component: AddItemModal', () => {
  const mockAddItem = getMockProduct();
  const onCloseButtonClick = vi.fn();
  const onBuyButtonClick = vi.fn();

  const createMockStore = (initialState: ReturnType<typeof getMockStore>) =>
    createStore(rootReducer, initialState);

  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = createMockStore(getMockStore());
  });

  it('renders correctly with a product', () => {
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
      screen.getByRole('button', { name: buyButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: closeButtonLabel })
    ).toBeInTheDocument();
  });

  it('calls onCloseButtonClick when close button is clicked', () => {
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

    fireEvent.click(screen.getByRole('button', { name: closeButtonLabel }));
    expect(onCloseButtonClick).toHaveBeenCalledTimes(1);
  });

  it('dispatches addItemToBasket and calls onBuyButtonClick when buy button is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const buyButtonText = /Добавить в корзину/i;

    render(
      <Provider store={store}>
        <AddItemModal
          addItem={mockAddItem}
          onCloseButtonClick={onCloseButtonClick}
          onBuyButtonClick={onBuyButtonClick}
        />
      </Provider>
    );

    const buyButton = screen.getByRole('button', {
      name: buyButtonText,
    });
    fireEvent.click(buyButton);
    expect(dispatchSpy).toHaveBeenCalledWith(addItemToBasket(mockAddItem.id));
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(onBuyButtonClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard navigation between buttons', async () => {
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

    const closeButton = screen.getByRole('button', { name: closeButtonLabel });
    const buyButton = screen.getByRole('button', {
      name: buyButtonText,
    });

    expect(document.activeElement).toBe(buyButton);

    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(closeButton);

    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).toBe(buyButton);
  });

  it('renders SomethingWrongModal when addItem is null', () => {
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
