import { render, screen } from '@testing-library/react';
import ProductImage from './product-image';

describe('Component: ProductImage', () => {
  const mockImage = {
    previewImg: 'image.jpg',
    previewImg2x: 'image@2x.jpg',
    previewImgWebp: 'image.webp',
    previewImgWebp2x: 'image@2x.webp',
    name: 'Тестовое изображение',
  };

  it('should renders image with correct attributes', () => {
    render(<ProductImage image={mockImage} />);

    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('src', '/image.jpg');
    expect(imgElement).toHaveAttribute('srcSet', '/image@2x.jpg 2x');
    expect(imgElement).toHaveAttribute('alt', mockImage.name);

    const sourceElement = screen.getByTestId('source');
    expect(sourceElement).toHaveAttribute('type', 'image/webp');
    expect(sourceElement).toHaveAttribute(
      'srcSet',
      '/image.webp, /image@2x.webp 2x'
    );
  });

  it('should renders image with custom size', () => {
    const customSize = { width: 200, height: 150 };

    render(<ProductImage image={mockImage} size={customSize} />);

    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('width', String(customSize.width));
    expect(imgElement).toHaveAttribute('height', String(customSize.height));
  });

  it('should renders image with default size if no size prop is provided', () => {
    render(<ProductImage image={mockImage} />);

    const imgElement = screen.getByRole('img');
    expect(imgElement).toHaveAttribute('width', String(140));
    expect(imgElement).toHaveAttribute('height', String(120));
  });
});
