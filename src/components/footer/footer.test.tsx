import { render, screen } from '@testing-library/react';
import Footer from './footer';

describe('Component: Footer', () => {
  it('should renders footer with correct information', () => {
    render(<Footer />);

    expect(screen.getByLabelText(/переход на главную/i)).toBeInTheDocument();
    expect(
      screen.getByText(/интернет-магазин фото- и видеотехники/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/навигация/i)).toBeInTheDocument();
    expect(screen.getByText(/ресурсы/i)).toBeInTheDocument();
    expect(screen.getByText(/поддержка/i)).toBeInTheDocument();

    expect(screen.getByText(/каталог/i)).toBeInTheDocument();
    expect(screen.getByText(/гарантии/i)).toBeInTheDocument();
    expect(screen.getByText(/доставка/i)).toBeInTheDocument();
    expect(screen.getByText(/о компании/i)).toBeInTheDocument();

    expect(
      screen.getByLabelText(/переход на страницу вконтатке/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/переход на страницу pinterest/i)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/переход на страницу reddit/i)
    ).toBeInTheDocument();
  });

  it('should contain correct social media links', () => {
    render(<Footer />);

    const vkLink = screen.getByLabelText(/переход на страницу вконтатке/i);
    const pinterestLink = screen.getByLabelText(
      /переход на страницу pinterest/i
    );
    const redditLink = screen.getByLabelText(/переход на страницу reddit/i);

    expect(vkLink).toHaveAttribute('href', '#');
    expect(pinterestLink).toHaveAttribute('href', '#');
    expect(redditLink).toHaveAttribute('href', '#');
  });

  it('should renders all navigation items', () => {
    render(<Footer />);

    const navItems = [
      'каталог',
      'гарантии',
      'доставка',
      'о компании',
      'курсы операторов',
      'блог',
      'сообщество',
      'faq',
      'задать вопрос',
    ];

    navItems.forEach((item) => {
      expect(screen.getByText(new RegExp(item, 'i'))).toBeInTheDocument();
    });
  });
});
