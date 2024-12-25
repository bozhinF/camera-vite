import { render, screen } from '@testing-library/react';
import { Product } from '../../types/types';
import ProductPrice from './product-price';
import { getMockProduct } from '../../util/mocks';

describe('Component: ProductPrice', () => {
  it('should renders price correctly', () => {
    const mockProduct: Product = getMockProduct();
    mockProduct.price = 1500;

    render(<ProductPrice product={mockProduct} />);

    const priceElement = screen.getByText(/1 500 ₽/i);
    expect(priceElement).toBeInTheDocument();
  });

  it('should renders price with correct formatting', () => {
    const productWithDecimalPrice: Product = getMockProduct();
    productWithDecimalPrice.price = 1500.5;

    render(<ProductPrice product={productWithDecimalPrice} />);

    const priceElement = screen.getByText(/1 500,5 ₽/i);
    expect(priceElement).toBeInTheDocument();
  });

  it('should renders price with large number correctly', () => {
    const productWithLargePrice: Product = getMockProduct();
    productWithLargePrice.price = 1000000;

    render(<ProductPrice product={productWithLargePrice} />);

    const priceElement = screen.getByText(/1 000 000 ₽/i);
    expect(priceElement).toBeInTheDocument();
  });
});
