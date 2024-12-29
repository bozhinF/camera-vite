import { fireEvent, render, screen } from '@testing-library/react';
import { withHistory } from '../../util/mock-component';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { AppRoute, ElementRole, UserEventKey } from '../../const/const';
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
      screen.getByRole(ElementRole.Button, { name: continiueButtonText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: closeButtonLabel })
    ).toBeInTheDocument();
  });

  it('should calls onCloseButtonClick when close button is clicked', () => {
    const closeButtonLabel = /Закрыть попап/i;
    const expectedOnCloseButtonClickCalledTimes = 1;
    const withHistoryComponent = withHistory(
      <OrderSuccessModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    fireEvent.click(
      screen.getByRole(ElementRole.Button, { name: closeButtonLabel })
    );
    expect(onCloseButtonClick).toHaveBeenCalledTimes(
      expectedOnCloseButtonClickCalledTimes
    );
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

    const continiueButton = screen.getByRole(ElementRole.Button, {
      name: continiueButtonText,
    });
    const closeButton = screen.getByRole(ElementRole.Button, {
      name: closeButtonLabel,
    });
    expect(continiueButton).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(document.activeElement).toBe(continiueButton);
    await userEvent.keyboard(UserEventKey.ShiftTab);
    expect(document.activeElement).toBe(closeButton);
    await userEvent.keyboard(UserEventKey.Tab);
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

    fireEvent.click(
      screen.getByRole(ElementRole.Button, { name: continiueButtonText })
    );
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

    fireEvent.click(
      screen.getByRole(ElementRole.Button, { name: closeButtonLabel })
    );
    const { pathname } = mockHistory.location;
    expect(pathname).toBe(AppRoute.Catalog);
  });
});
