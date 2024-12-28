import { render, screen } from '@testing-library/react';
import Banner from './banner';
import { ElementAttribute, ElementRole, ElementTag } from '../../const/const';

describe('Component: Banner', () => {
  it('should renders the banner correctly', () => {
    const bannerText = /баннер/i;
    const bannerImageSrc = '/img/content/banner-bg.jpg';
    const bannerImageWidth = '1280';
    const bannerImageHeight = '280';
    const newProductText = /Новинка!/i;
    const productNameText = /Cannonball Pro MX 8i/i;
    const productDescriptionText =
      /Профессиональная камера от известного производителя/i;
    const moreDetailsText = /Подробнее/i;
    const bannerClassName = 'banner';
    const expectedHrefAttribute = '#';

    render(<Banner />);

    const imgElement = screen.getByRole(ElementRole.Image, {
      name: bannerText,
    });
    const buttonElement = screen.getByRole(ElementRole.Link, {
      name: moreDetailsText,
    });
    const bannerElement = screen
      .getByText(newProductText)
      .closest(ElementTag.Div);
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute(ElementAttribute.Src, bannerImageSrc);
    expect(imgElement).toHaveAttribute(
      ElementAttribute.Width,
      bannerImageWidth
    );
    expect(imgElement).toHaveAttribute(
      ElementAttribute.Height,
      bannerImageHeight
    );
    expect(screen.getByText(newProductText)).toBeInTheDocument();
    expect(screen.getByText(productNameText)).toBeInTheDocument();
    expect(screen.getByText(productDescriptionText)).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute(
      ElementAttribute.Href,
      expectedHrefAttribute
    );
    expect(bannerElement).toHaveClass(bannerClassName);
  });
});
