import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoute } from '../../const/const';
import NotFoundPage from './not-found-page';

describe('Component: NotFoundPage', () => {
  it('should renders NotFoundPage with 404 message', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading')).toHaveTextContent(
      '404: Page Not Found'
    );
  });

  it('should renders link to Main page', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const linkElement = screen.getByRole('link', { name: /Go to Main page/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', AppRoute.Main);
  });
});
