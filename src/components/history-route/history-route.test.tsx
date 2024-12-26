import { render, screen } from '@testing-library/react';
import { createMemoryHistory, MemoryHistory } from 'history';
import HistoryRouter from './history-route';

describe('Component: HistoryRouter', () => {
  let history: MemoryHistory;

  beforeEach(() => {
    history = createMemoryHistory();
  });

  it('should renders children correctly', () => {
    render(
      <HistoryRouter history={history}>
        <div>Test Child</div>
      </HistoryRouter>
    );

    expect(screen.getByText(/Test Child/i)).toBeInTheDocument();
  });

  it('should updates state on history change', () => {
    const TestComponent = () => (
      <div>
        <button onClick={() => history.push('/new-route')}>
          Go to new route
        </button>
      </div>
    );

    render(
      <HistoryRouter history={history}>
        <TestComponent />
      </HistoryRouter>
    );

    expect(history.location.pathname).toBe('/');

    screen.getByRole('button', { name: /Go to new route/i }).click();

    expect(history.location.pathname).toBe('/new-route');
  });
});
