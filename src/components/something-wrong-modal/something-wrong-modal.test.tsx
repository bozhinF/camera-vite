import { fireEvent, render, screen } from '@testing-library/react';
import { withHistory } from '../../util/mock-component';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { AppRoute, ElementRole, UserEventKey } from '../../const/const';
import SomethingWrongModal from './something-wrong-modal';

describe('Component: SomethingWrongModal', () => {
  let mockHistory: MemoryHistory;
  const onCloseButtonClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders correctly', () => {
    const title = /Произошел сбой/i;
    const linkText = /Справочный центр/i;
    const closeButtonLabel = /Закрыть попап/i;
    const withHistoryComponent = withHistory(
      <SomethingWrongModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Link, { name: linkText })
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: closeButtonLabel })
    ).toBeInTheDocument();
  });

  it('should calls onCloseButtonClick when close button is clicked', () => {
    const closeButtonLabel = /Закрыть попап/i;
    const expectedOnCloseButtonClickCalledTimes = 1;
    const withHistoryComponent = withHistory(
      <SomethingWrongModal onCloseButtonClick={onCloseButtonClick} />,
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
    const linkText = /Справочный центр/i;
    const closeButtonLabel = /Закрыть попап/i;
    const withHistoryComponent = withHistory(
      <SomethingWrongModal onCloseButtonClick={onCloseButtonClick} />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    const linkElement = screen.getByRole(ElementRole.Link, {
      name: linkText,
    });
    const closeButton = screen.getByRole(ElementRole.Button, {
      name: closeButtonLabel,
    });
    expect(document.activeElement).toBe(linkElement);
    await userEvent.keyboard(UserEventKey.ShiftTab);
    expect(document.activeElement).toBe(closeButton);
    await userEvent.keyboard(UserEventKey.Tab);
    expect(document.activeElement).toBe(linkElement);
  });
});
