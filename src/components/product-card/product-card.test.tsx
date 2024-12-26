import { render, screen, fireEvent } from '@testing-library/react';
import { Product } from '../../types/types';
import { AppRoute } from '../../const/const';
import ProductCard from './product-card';
import { getMockProduct } from '../../util/mocks';
import { createMemoryHistory, MemoryHistory } from 'history';
import { withHistory } from '../../util/mock-component';
import { divideNumberByPieces } from '../../util/util';

describe('Component: ProductCard', () => {
  let mockHistory: MemoryHistory;
  const mockOnBuyButtonClick = vi.fn();
  const mockProduct: Product = getMockProduct();

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders product information correctly', () => {
    const expectedProductName = mockProduct.name;
    const expectedProductPrice = `${divideNumberByPieces(mockProduct.price)} ₽`;
    const expectedProductReviewCount = mockProduct.reviewCount;
    const withHistoryComponent = withHistory(
      <ProductCard
        product={mockProduct}
        isInBasket={false}
        onBuyButtonClick={mockOnBuyButtonClick}
      />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    expect(screen.getByText(expectedProductName)).toBeInTheDocument();
    expect(screen.getByText(expectedProductPrice)).toBeInTheDocument();
    expect(screen.getByText(expectedProductReviewCount)).toBeInTheDocument();
  });

  it('should calls onBuyButtonClick when Buy button is clicked', () => {
    const expectedButtonText = /Купить/;
    const withHistoryComponent = withHistory(
      <ProductCard
        product={mockProduct}
        isInBasket={false}
        onBuyButtonClick={mockOnBuyButtonClick}
      />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    const buyButton = screen.getByRole('button', { name: expectedButtonText });

    fireEvent.click(buyButton);

    expect(mockOnBuyButtonClick).toHaveBeenCalledWith(mockProduct);
  });

  it('should displays correct button when product is in basket', () => {
    const expectedBuyButtonText = /Купить/;
    const expectedBasketButtonText = 'В корзине';
    const withHistoryComponent = withHistory(
      <ProductCard
        product={mockProduct}
        isInBasket
        onBuyButtonClick={mockOnBuyButtonClick}
      />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    expect(screen.getByText(expectedBasketButtonText)).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: expectedBuyButtonText })
    ).toBeNull();
  });

  it('should navigates to product details when Details button is clicked', () => {
    const productId = mockProduct.id.toString();
    const expectedDetailsLinkText = /Подробнее/;
    const expectedRoute = AppRoute.Product.replace(':id', productId);
    const withHistoryComponent = withHistory(
      <ProductCard
        product={mockProduct}
        isInBasket={false}
        onBuyButtonClick={mockOnBuyButtonClick}
      />,
      mockHistory
    );
    mockHistory.push(AppRoute.Catalog);

    render(withHistoryComponent);

    const detailsButton = screen.getByRole('link', {
      name: expectedDetailsLinkText,
    });
    expect(detailsButton).toHaveAttribute('href', expectedRoute);
  });
});
