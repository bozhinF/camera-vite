import { render, screen } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import HistoryRouter from './history-router';
import { ElementRole } from '../../const/const';

describe('Component: HistoryRouter', () => {
  let history: MemoryHistory;

  beforeEach(() => {
    history = createMemoryHistory();
  });

  it('should renders children correctly', () => {
    const expectedTestChildText = 'Test Child';

    render(
      <HistoryRouter history={history}>
        <div>{expectedTestChildText}</div>
      </HistoryRouter>
    );

    expect(screen.getByText(expectedTestChildText)).toBeInTheDocument();
  });

  it('should updates state on history change', () => {
    const baseLocation = '/';
    const newRouteLocation = '/new-route';
    const goToNewRouteText = 'Go to new route';
    const TestComponent = () => (
      <div>
        <button onClick={() => history.push(newRouteLocation)}>
          {goToNewRouteText}
        </button>
      </div>
    );

    render(
      <HistoryRouter history={history}>
        <TestComponent />
      </HistoryRouter>
    );

    expect(history.location.pathname).toBe(baseLocation);
    screen.getByRole(ElementRole.Button, { name: goToNewRouteText }).click();
    expect(history.location.pathname).toBe(newRouteLocation);
  });
});
