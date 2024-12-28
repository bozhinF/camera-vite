import { render, screen, fireEvent } from '@testing-library/react';
import { Products } from '../../types/types';
import Filter from './filter';
import { ElementRole } from '../../const/const';
import { getMockFilterState, getMockProduct } from '../../util/mocks';

describe('Component: Filter', () => {
  const FILTERED_PRODUCTS_LENGTH = 3;
  const mockOnChange = vi.fn();
  const initialFilterState = getMockFilterState();

  const mockFilteredProducts: Products = Array.from(
    { length: FILTERED_PRODUCTS_LENGTH },
    getMockProduct
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders filter component with correct elements', () => {
    const expectedFilterHeading = /Фильтр/i;
    const priceTitleText = /Цена, ₽/i;
    const categotyTitleText = /Категория/i;
    const typeTitleText = /Тип камеры/i;
    const levelTitleText = /Уровень/i;
    const expectedResetButtonText = /Сбросить фильтры/i;

    render(
      <Filter
        filterState={initialFilterState}
        filteredProducts={mockFilteredProducts}
        onChange={mockOnChange}
      />
    );

    expect(
      screen.getByRole(ElementRole.Heading, { name: expectedFilterHeading })
    ).toBeInTheDocument();
    expect(screen.getByText(priceTitleText)).toBeInTheDocument();
    expect(screen.getByText(categotyTitleText)).toBeInTheDocument();
    expect(screen.getByText(typeTitleText)).toBeInTheDocument();
    expect(screen.getByText(levelTitleText)).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: expectedResetButtonText })
    ).toBeInTheDocument();
  });

  it('should calls onChange with reset parameters when reset button is clicked', () => {
    const expectedResetButtonText = /Сбросить фильтры/i;
    const expectedFilterUpdates = [
      { key: 'price', value: null },
      { key: 'priceUp', value: null },
      { key: 'category', value: '' },
      { key: 'type', value: [] },
      { key: 'level', value: [] },
    ];

    render(
      <Filter
        filterState={initialFilterState}
        filteredProducts={mockFilteredProducts}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(
      screen.getByRole(ElementRole.Button, { name: expectedResetButtonText })
    );

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining(initialFilterState),
      expect.arrayContaining(expectedFilterUpdates)
    );
  });
});
