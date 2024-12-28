import { render, screen } from '@testing-library/react';
import FailedToLoadPage from './failed-to-load-page';
import { HelmetProvider } from 'react-helmet-async';

describe('Component: FailedToLoadPage', () => {
  it('should renders correctly', () => {
    const expectedText = 'Ошибка загрузки информации';

    render(
      <HelmetProvider>
        <FailedToLoadPage />
      </HelmetProvider>
    );

    expect(screen.getByText(expectedText)).toBeInTheDocument();
  });
});
