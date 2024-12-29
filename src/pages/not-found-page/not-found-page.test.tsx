import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoute, ElementAttribute, ElementRole } from '../../const/const';
import NotFoundPage from './not-found-page';

describe('Component: NotFoundPage', () => {
  it('should renders NotFoundPage with 404 message', () => {
    const expectedHeadingText = '404: Page Not Found';
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByRole(ElementRole.Heading)).toHaveTextContent(
      expectedHeadingText
    );
  });

  it('should renders link to Main page', () => {
    const expectedToMainPageLinkText = 'Go to Main page';
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const linkElement = screen.getByRole(ElementRole.Link, {
      name: expectedToMainPageLinkText,
    });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute(ElementAttribute.Href, AppRoute.Main);
  });
});
