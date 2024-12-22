import { createMemoryHistory, MemoryHistory } from 'history';
import { withHistory, withStore } from '../../util/mock-component';
import App from './app';
import { getMockStore } from '../../util/mocks';
import { render, screen } from '@testing-library/react';

describe('Application Routing', () => {
  let mockHistory: MemoryHistory;

  beforeEach(() => {
    mockHistory = createMemoryHistory();
  });

  it('should render "NotFoundPage" when user navigate to non-existent route', () => {
    const withHistoryComponent = withHistory(<App />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    const unknownRoute = '/unknown-route';
    mockHistory.push(unknownRoute);

    render(withStoreComponent);

    expect(screen.getByText('404: Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Go to Main page')).toBeInTheDocument();
  });
});
