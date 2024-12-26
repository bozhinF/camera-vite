import { render, screen } from '@testing-library/react';
import Banner from './banner';

describe('Component: Banner', () => {
  it('should renders the banner correctly', () => {
    render(<Banner />);

    const imgElement = screen.getByRole('img', { name: /баннер/i });
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute('src', '/img/content/banner-bg.jpg');
    expect(imgElement).toHaveAttribute('width', '1280');
    expect(imgElement).toHaveAttribute('height', '280');

    expect(screen.getByText(/Новинка!/i)).toBeInTheDocument();

    expect(screen.getByText(/Cannonball Pro MX 8i/i)).toBeInTheDocument();

    expect(
      screen.getByText(/Профессиональная камера от известного производителя/i)
    ).toBeInTheDocument();

    const buttonElement = screen.getByRole('link', { name: /Подробнее/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('href', '#');

    const bannerElement = screen.getByText(/Новинка!/i).closest('div');
    expect(bannerElement).toHaveClass('banner');
  });
});
