import { fireEvent, render, screen } from '@testing-library/react';
import { withHistory } from '../../util/mock-component';
import { getMockProduct, getMockStore } from '../../util/mocks';
import { createMemoryHistory } from 'history';
import { rootReducer } from '../../store/root-reducer';
import { createStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { updateBasket } from '../../store/products-slice/products-slice';
import userEvent from '@testing-library/user-event';
import RemoveItemModal from './remove-item-modal';
import { ElementRole, NameSpace, UserEventKey } from '../../const/const';
import { State } from '../../types/state';

describe('Component: RemoveItemModal', () => {
  const mockRemoveItem = getMockProduct();
  const onCloseButtonClick = vi.fn();

  const createMockStore = (initialState: State) =>
    createStore(rootReducer, initialState);

  let store: ReturnType<typeof createMockStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    const mockStore = getMockStore();
    mockStore[NameSpace.Products].basket = [mockRemoveItem.id];
    store = createMockStore(mockStore);
  });

  it('should renders correctly with a product', () => {
    const title = /Удалить этот товар/i;
    const productName = mockRemoveItem.name;
    const productVendorCode = mockRemoveItem.vendorCode;
    const productCategory = `${mockRemoveItem.type} ${
      mockRemoveItem.category === 'Фотоаппарат'
        ? 'фотокамера'
        : mockRemoveItem.category.toLowerCase()
    }`;
    const productLevel = `${mockRemoveItem.level} уровень`;
    const deleteButtonText = /Удалить/i;
    const continiueButtonText = /Продолжить покупки/i;
    const closeButtonLabel = /Закрыть попап/i;
    const mockHistory = createMemoryHistory();
    const withHistoryComponent = withHistory(
      <Provider store={store}>
        <RemoveItemModal
          removeItem={mockRemoveItem}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>,
      mockHistory
    );

    render(withHistoryComponent);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(productName)).toBeInTheDocument();
    expect(screen.getByText(productVendorCode)).toBeInTheDocument();
    expect(screen.getByText(productCategory)).toBeInTheDocument();
    expect(screen.getByText(productLevel)).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: deleteButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Link, { name: continiueButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: closeButtonLabel })
    ).toBeInTheDocument();
  });

  it('should calls onCloseButtonClick when close button is clicked', () => {
    const closeButtonLabel = /Закрыть попап/i;
    const expectedOnCloseButtonClickCalledTimes = 1;
    const mockHistory = createMemoryHistory();
    const withHistoryComponent = withHistory(
      <Provider store={store}>
        <RemoveItemModal
          removeItem={mockRemoveItem}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>,
      mockHistory
    );

    render(withHistoryComponent);

    fireEvent.click(
      screen.getByRole(ElementRole.Button, { name: closeButtonLabel })
    );
    expect(onCloseButtonClick).toHaveBeenCalledTimes(
      expectedOnCloseButtonClickCalledTimes
    );
  });

  it('should dispatches updateBasket and calls onCloseButtonClick when remove button is clicked', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const deleteButtonText = /Удалить/i;
    const expectedUpdate: number[] = [];
    const expectedDispatchSpyCalledTimes = 1;
    const mockHistory = createMemoryHistory();
    const withHistoryComponent = withHistory(
      <Provider store={store}>
        <RemoveItemModal
          removeItem={mockRemoveItem}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>,
      mockHistory
    );

    render(withHistoryComponent);

    const deleteButton = screen.getByRole(ElementRole.Button, {
      name: deleteButtonText,
    });
    fireEvent.click(deleteButton);
    expect(dispatchSpy).toHaveBeenCalledWith(updateBasket(expectedUpdate));
    expect(dispatchSpy).toHaveBeenCalledTimes(expectedDispatchSpyCalledTimes);
  });

  it('should handles keyboard navigation between buttons', async () => {
    const deleteButtonText = /Удалить/i;
    const continiueButtonText = /Продолжить покупки/i;
    const closeButtonLabel = /Закрыть попап/i;
    const mockHistory = createMemoryHistory();
    const withHistoryComponent = withHistory(
      <Provider store={store}>
        <RemoveItemModal
          removeItem={mockRemoveItem}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>,
      mockHistory
    );

    render(withHistoryComponent);

    const deleteButton = screen.getByRole(ElementRole.Button, {
      name: deleteButtonText,
    });
    const continiueButton = screen.getByRole(ElementRole.Link, {
      name: continiueButtonText,
    });
    const closeButton = screen.getByRole(ElementRole.Button, {
      name: closeButtonLabel,
    });
    expect(document.activeElement).toBe(deleteButton);
    await userEvent.keyboard(UserEventKey.Tab);
    expect(document.activeElement).toBe(continiueButton);
    await userEvent.keyboard(UserEventKey.Tab);
    expect(document.activeElement).toBe(closeButton);
    await userEvent.keyboard(UserEventKey.Tab);
    expect(document.activeElement).toBe(deleteButton);
    await userEvent.keyboard(UserEventKey.ShiftTab);
    expect(document.activeElement).toBe(closeButton);
  });

  it('should renders SomethingWrongModal when addItem is null', () => {
    const somethingWrongModalText = /Что-то пошло не так/i;
    const mockHistory = createMemoryHistory();
    const withHistoryComponent = withHistory(
      <Provider store={store}>
        <RemoveItemModal
          removeItem={null}
          onCloseButtonClick={onCloseButtonClick}
        />
      </Provider>,
      mockHistory
    );

    render(withHistoryComponent);

    expect(screen.getByText(somethingWrongModalText)).toBeInTheDocument();
  });
});
