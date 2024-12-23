import { fireEvent, render, screen } from '@testing-library/react';
import { withHistory, withStore } from '../../util/mock-component';
import { getMockProduct, getMockStore } from '../../util/mocks';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import AddItemSuccessModal from './add-item-success-modal';
import { AppRoute, NameSpace, RequestStatus } from '../../const/const';

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
      screen.getByRole('link', { name: continiueButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: goToBasketButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: closeButtonLabel })
    ).toBeInTheDocument();
  });

  it('should calls onCloseButtonClick when close button is clicked', () => {
    const closeButtonLabel = /Закрыть попап/i;
    const withHistoryComponent = withHistory(
      <AddItemSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    fireEvent.click(screen.getByRole('button', { name: closeButtonLabel }));
    expect(onCloseButtonClick).toHaveBeenCalledTimes(1);
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

    const continiueButton = screen.getByRole('link', {
      name: continiueButtonText,
    });
    const closeButton = screen.getByRole('button', { name: closeButtonLabel });
    const goToBasketButton = screen.getByRole('button', {
      name: goToBasketButtonText,
    });

    expect(document.activeElement).toBe(goToBasketButton);

    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(closeButton);

    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(continiueButton);

    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).toBe(closeButton);
  });

  it('should render "CatalogPage" when user click "continiue"', () => {
    const continiueButtonText = /Продолжить покупки/i;
    const product = getMockProduct();
    const id = product.id;
    const mockStore = getMockStore();
    mockStore[NameSpace.Products].productDetails = product;
    mockStore[NameSpace.Products].productDetailsStatus = RequestStatus.Success;
    const withHistoryComponent = withHistory(
      <AddItemSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(`${AppRoute.Product.replace(':id', String(id))}`);

    render(withStoreComponent);

    fireEvent.click(screen.getByRole('link', { name: continiueButtonText }));
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

    fireEvent.click(screen.getByRole('button', { name: goToBasketButtonText }));
    const { pathname } = mockHistory.location;
    expect(pathname).toBe(AppRoute.Basket);
  });
});
