import { fireEvent, render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../util/mock-component';
import {
  getMockProduct,
  getMockProductsState,
  getMockStore,
} from '../../util/mocks';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import AddItemSuccessModal from './add-item-success-modal';
import {
  AppRoute,
  ElementRole,
  NameSpace,
  RequestStatus,
  UserEventKey,
} from '../../const/const';

describe('Component: AddItemSuccessModal', () => {
  let mockHistory: MemoryHistory;
  const onCloseButtonClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders correctly', () => {
    const title = /Товар успешно добавлен в корзину/i;
    const continiueButtonText = /Продолжить покупки/i;
    const goToBasketButtonText = /Перейти в корзину/i;
    const closeButtonLabel = /Закрыть попап/i;
    const withHistoryComponent = withHistory(
      <AddItemSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Link, { name: continiueButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: goToBasketButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: closeButtonLabel })
    ).toBeInTheDocument();
  });

  it('should calls onCloseButtonClick when close button is clicked', () => {
    const closeButtonLabel = /Закрыть попап/i;
    const expectOnCloseButtonClickCalledTimes = 1;
    const withHistoryComponent = withHistory(
      <AddItemSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    fireEvent.click(
      screen.getByRole(ElementRole.Button, { name: closeButtonLabel })
    );
    expect(onCloseButtonClick).toHaveBeenCalledTimes(
      expectOnCloseButtonClickCalledTimes
    );
  });

  it('should handles keyboard navigation between buttons', async () => {
    const continiueButtonText = /Продолжить покупки/i;
    const goToBasketButtonText = /Перейти в корзину/i;
    const closeButtonLabel = /Закрыть попап/i;
    const withHistoryComponent = withHistory(
      <AddItemSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    const continiueButton = screen.getByRole(ElementRole.Link, {
      name: continiueButtonText,
    });
    const closeButton = screen.getByRole(ElementRole.Button, {
      name: closeButtonLabel,
    });
    const goToBasketButton = screen.getByRole(ElementRole.Button, {
      name: goToBasketButtonText,
    });

    expect(document.activeElement).toBe(goToBasketButton);

    await userEvent.keyboard(UserEventKey.Tab);
    expect(document.activeElement).toBe(closeButton);

    await userEvent.keyboard(UserEventKey.Tab);
    expect(document.activeElement).toBe(continiueButton);

    await userEvent.keyboard(UserEventKey.ShiftTab);
    expect(document.activeElement).toBe(closeButton);
  });

  it('should render "CatalogPage" when user click "continiue"', () => {
    const continiueButtonText = /Продолжить покупки/i;
    const product = getMockProduct();
    const id = product.id;
    const mockProductsState = getMockProductsState({
      productDetails: product,
      productDetailsStatus: RequestStatus.Success,
    });
    const mockStore = getMockStore({ [NameSpace.Products]: mockProductsState });
    const withHistoryComponent = withHistory(
      <AddItemSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(`${AppRoute.Product.replace(':id', String(id))}`);

    render(withStoreComponent);

    fireEvent.click(
      screen.getByRole(ElementRole.Link, { name: continiueButtonText })
    );
    const { pathname } = mockHistory.location;
    expect(pathname).toBe(AppRoute.Catalog);
  });

  it('should render "BasketPage" when user click "go to basket"', () => {
    const goToBasketButtonText = /Перейти в корзину/i;
    const withHistoryComponent = withHistory(
      <AddItemSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    fireEvent.click(
      screen.getByRole(ElementRole.Button, { name: goToBasketButtonText })
    );
    const { pathname } = mockHistory.location;
    expect(pathname).toBe(AppRoute.Basket);
  });
});
