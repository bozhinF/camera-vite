import { render, screen } from '@testing-library/react';
import ProductImage from './product-image';
import { ElementAttribute, ElementRole } from '../../const/const';

describe('Component: ProductImage', () => {
  const mockImage = {
    previewImg: 'image.jpg',
    previewImg2x: 'image@2x.jpg',
    previewImgWebp: 'image.webp',
    previewImgWebp2x: 'image@2x.webp',
    name: 'Тестовое изображение',
  };

  it('should renders image with correct attributes', () => {
    const sourceElementTestId = 'source';
    const expectedImgElementSrc = `/${mockImage.previewImg}`;
    const expectedImgElementSrcSet = `/${mockImage.previewImg2x} 2x`;
    const expectedSourceElementType = 'image/webp';
    const expectedSourceElementSrcSet = `/${mockImage.previewImgWebp}, /${mockImage.previewImgWebp2x} 2x`;

    render(<ProductImage image={mockImage} />);

    const imgElement = screen.getByRole(ElementRole.Image);
    const sourceElement = screen.getByTestId(sourceElementTestId);
    expect(imgElement).toHaveAttribute(
      ElementAttribute.Src,
      expectedImgElementSrc
    );
    expect(imgElement).toHaveAttribute(
      ElementAttribute.SrcSet,
      expectedImgElementSrcSet
    );
    expect(imgElement).toHaveAttribute(ElementAttribute.Alt, mockImage.name);
    expect(sourceElement).toHaveAttribute(
      ElementAttribute.Type,
      expectedSourceElementType
    );
    expect(sourceElement).toHaveAttribute(
      ElementAttribute.SrcSet,
      expectedSourceElementSrcSet
    );
  });

  it('should renders image with custom size', () => {
    const customSize = { width: 200, height: 150 };

    render(<ProductImage image={mockImage} size={customSize} />);

    const imgElement = screen.getByRole(ElementRole.Image);
    expect(imgElement).toHaveAttribute(
      ElementAttribute.Width,
      String(customSize.width)
    );
    expect(imgElement).toHaveAttribute(
      ElementAttribute.Height,
      String(customSize.height)
    );
  });

  it('should renders image with default size if no size prop is provided', () => {
    const expectedDefaultWidthAttributeValue = '140';
    const expectedDefaultHeightAttributeValue = '120';

    render(<ProductImage image={mockImage} />);

    const imgElement = screen.getByRole(ElementRole.Image);
    expect(imgElement).toHaveAttribute(
      ElementAttribute.Width,
      expectedDefaultWidthAttributeValue
    );
    expect(imgElement).toHaveAttribute(
      ElementAttribute.Height,
      expectedDefaultHeightAttributeValue
    );
  });
});
