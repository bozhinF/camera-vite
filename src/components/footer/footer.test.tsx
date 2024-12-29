import { render, screen } from '@testing-library/react';
import Footer from './footer';
import { ElementAttribute } from '../../const/const';

describe('Component: Footer', () => {
  it('should renders footer with correct information', () => {
    const expectedLogoLinkLabelText = /переход на главную/i;
    const expectedDescriptionText = /интернет-магазин фото- и видеотехники/i;
    const expectedNavigationText = /навигация/i;
    const expectedResourcesText = /ресурсы/i;
    const expectedSupportText = /поддержка/i;
    const expectedCatalogText = /каталог/i;
    const expectedGuaranteesText = /гарантии/i;
    const expectedDeliveryText = /доставка/i;
    const expectedAboutText = /о компании/i;
    const expectedVkontakteLinkLabelText = /переход на страницу вконтатке/i;
    const expectedPinterestLinkLabelText = /переход на страницу pinterest/i;
    const expectedRedditLinkLabelText = /переход на страницу reddit/i;

    render(<Footer />);

    expect(
      screen.getByLabelText(expectedLogoLinkLabelText)
    ).toBeInTheDocument();
    expect(screen.getByText(expectedDescriptionText)).toBeInTheDocument();
    expect(screen.getByText(expectedNavigationText)).toBeInTheDocument();
    expect(screen.getByText(expectedResourcesText)).toBeInTheDocument();
    expect(screen.getByText(expectedSupportText)).toBeInTheDocument();
    expect(screen.getByText(expectedCatalogText)).toBeInTheDocument();
    expect(screen.getByText(expectedGuaranteesText)).toBeInTheDocument();
    expect(screen.getByText(expectedDeliveryText)).toBeInTheDocument();
    expect(screen.getByText(expectedAboutText)).toBeInTheDocument();
    expect(
      screen.getByLabelText(expectedVkontakteLinkLabelText)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(expectedPinterestLinkLabelText)
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(expectedRedditLinkLabelText)
    ).toBeInTheDocument();
  });

  it('should contain correct social media links', () => {
    const expectedVkontakteLinkLabelText = /переход на страницу вконтатке/i;
    const expectedPinterestLinkLabelText = /переход на страницу pinterest/i;
    const expectedRedditLinkLabelText = /переход на страницу reddit/i;
    const expectedLink = '#';

    render(<Footer />);

    const vkLink = screen.getByLabelText(expectedVkontakteLinkLabelText);
    const pinterestLink = screen.getByLabelText(expectedPinterestLinkLabelText);
    const redditLink = screen.getByLabelText(expectedRedditLinkLabelText);
    expect(vkLink).toHaveAttribute(ElementAttribute.Href, expectedLink);
    expect(pinterestLink).toHaveAttribute(ElementAttribute.Href, expectedLink);
    expect(redditLink).toHaveAttribute(ElementAttribute.Href, expectedLink);
  });

  it('should renders all navigation items', () => {
    const navItems = [
      'Каталог',
      'Гарантии',
      'Доставка',
      'О компании',
      'Курсы операторов',
      'Блог',
      'Сообщество',
      'FAQ',
      'Задать вопрос',
    ];

    render(<Footer />);

    navItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });
});
