import { fireEvent, render, screen } from '@testing-library/react';
import { withHistory } from '../../util/mock-component';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { AppRoute } from '../../const/const';
import OrderSuccessModal from './order-success-modal';

describe('Component: OrderSuccessModal', () => {
  let mockHistory: MemoryHistory;
  const onCloseButtonClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders correctly', () => {
    const title = /Спасибо за покупку/i;
    const continiueButtonText = /Вернуться к покупкам/i;
    const closeButtonLabel = /Закрыть попап/i;
    const withHistoryComponent = withHistory(
      <OrderSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: continiueButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: closeButtonLabel })
    ).toBeInTheDocument();
  });

  it('should calls onCloseButtonClick when close button is clicked', () => {
    const closeButtonLabel = /Закрыть попап/i;
    const withHistoryComponent = withHistory(
      <OrderSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    fireEvent.click(screen.getByRole('button', { name: closeButtonLabel }));
    expect(onCloseButtonClick).toHaveBeenCalledTimes(1);
  });

  it('should handles keyboard navigation between buttons', async () => {
    const continiueButtonText = /Вернуться к покупкам/i;
    const closeButtonLabel = /Закрыть попап/i;
    const withHistoryComponent = withHistory(
      <OrderSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    const continiueButton = screen.getByRole('button', {
      name: continiueButtonText,
    });
    const closeButton = screen.getByRole('button', { name: closeButtonLabel });

    expect(continiueButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();

    expect(document.activeElement).toBe(continiueButton);

    await userEvent.keyboard('{Shift>}{Tab}{/Shift}');
    expect(document.activeElement).toBe(closeButton);

    await userEvent.keyboard('{Tab}');
    expect(document.activeElement).toBe(continiueButton);
  });

  it('should render "CatalogPage" when user click "continiue"', () => {
    const continiueButtonText = /Вернуться к покупкам/i;
    const withHistoryComponent = withHistory(
      <OrderSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Basket);

    render(withHistoryComponent);

    fireEvent.click(screen.getByRole('button', { name: continiueButtonText }));
    const { pathname } = mockHistory.location;
    expect(pathname).toBe(AppRoute.Catalog);
  });

  it('should render "CatalogPage" when close button is clicked', () => {
    const closeButtonLabel = /Закрыть попап/i;
    const withHistoryComponent = withHistory(
      <OrderSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Basket);

    render(withHistoryComponent);

    fireEvent.click(screen.getByRole('button', { name: closeButtonLabel }));
    const { pathname } = mockHistory.location;
    expect(pathname).toBe(AppRoute.Catalog);
  });
});
