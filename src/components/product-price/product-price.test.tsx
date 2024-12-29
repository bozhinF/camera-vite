import { render, screen } from '@testing-library/react';
import { Product } from '../../types/types';
import ProductPrice from './product-price';
import { getMockProduct } from '../../util/mocks';

describe('Component: ProductPrice', () => {
  it('should renders price correctly', () => {
    const expectedPriceElementText = /1 500 ₽/i;
    const mockProduct: Product = getMockProduct();
    mockProduct.price = 1500;

    render(<ProductPrice product={mockProduct} />);

    const priceElement = screen.getByText(expectedPriceElementText);
    expect(priceElement).toBeInTheDocument();
  });

  it('should renders price with correct formatting', () => {
    const expectedPriceElementText = /1 500,5 ₽/i;
    const productWithDecimalPrice: Product = getMockProduct();
    productWithDecimalPrice.price = 1500.5;

    render(<ProductPrice product={productWithDecimalPrice} />);

    const priceElement = screen.getByText(expectedPriceElementText);
    expect(priceElement).toBeInTheDocument();
  });

  it('should renders price with large number correctly', () => {
    const expectedPriceElementText = /1 000 000 ₽/i;
    const productWithLargePrice: Product = getMockProduct();
    productWithLargePrice.price = 1000000;

    render(<ProductPrice product={productWithLargePrice} />);

    const priceElement = screen.getByText(expectedPriceElementText);
    expect(priceElement).toBeInTheDocument();
  });
});
