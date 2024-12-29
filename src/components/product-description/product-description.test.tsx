import { render, screen } from '@testing-library/react';
import { Product } from '../../types/types';
import ProductDescription from './product-description';
import { getMockProduct } from '../../util/mocks';
import { ElementRole } from '../../const/const';

describe('Component: ProductDescription', () => {
  const mockProduct: Product = getMockProduct();

  it('should renders product name', () => {
    const expectedProductName = mockProduct.name;

    render(<ProductDescription product={mockProduct} />);

    const titleElement = screen.getByText(expectedProductName);
    expect(titleElement).toBeInTheDocument();
  });

  it('should renders vendor code', () => {
    const expectedArticleElementText = /артикул:/i;
    const expectedProductVendorCode = mockProduct.vendorCode;

    render(<ProductDescription product={mockProduct} />);

    const articleElement = screen.getByText(expectedArticleElementText);
    const numberElement = screen.getByText(expectedProductVendorCode);
    expect(articleElement).toBeInTheDocument();
    expect(numberElement).toBeInTheDocument();
  });

  it('should renders type and category', () => {
    const expectedText = `${mockProduct.type} ${
      mockProduct.category === 'Фотоаппарат'
        ? 'фотокамера'
        : mockProduct.category.toLowerCase()
    }`;

    render(<ProductDescription product={mockProduct} />);

    const listItemElements = screen.getAllByRole(ElementRole.Listitem);
    const expectedListElement = listItemElements[1];
    expect(expectedListElement).toHaveTextContent(expectedText);
  });

  it('should renders level', () => {
    const expectedText = `${mockProduct.level} уровень`;

    render(<ProductDescription product={mockProduct} />);

    const levelElement = screen.getByText(expectedText);
    expect(levelElement).toBeInTheDocument();
  });

  it('should renders children if provided', () => {
    const expectedText = 'Детали продукта';

    render(
      <ProductDescription product={mockProduct}>
        <div>{expectedText}</div>
      </ProductDescription>
    );

    const childrenElement = screen.getByText(expectedText);
    expect(childrenElement).toBeInTheDocument();
  });

  it('should does not render children if not provided', () => {
    const notExpectedText = 'Детали продукта';

    render(<ProductDescription product={mockProduct} />);

    const childrenElement = screen.queryByText(notExpectedText);
    expect(childrenElement).not.toBeInTheDocument();
  });
});
