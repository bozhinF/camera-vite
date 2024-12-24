import { render, screen, fireEvent } from '@testing-library/react';
import { FilterState } from '../../store/filter-slice/filter-slice';
import { Products } from '../../types/types';
import Filter from './filter';
import { FilterOption } from '../../const/const';
import { getMockProduct } from '../../util/mocks';

describe('Component: Filter', () => {
  const mockOnChange = vi.fn();
  const initialFilterState: FilterState = {
    sort: FilterOption.sort[0].value,
    order: FilterOption.order[0].value,
    price: null,
    priceUp: null,
    category: '',
    type: [],
    level: [],
    page: null,
    tab: FilterOption.tab[0].value,
  };

  const mockFilteredProducts: Products = [
    getMockProduct(),
    getMockProduct(),
    getMockProduct(),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders filter component with correct elements', () => {
    render(
      <Filter
        filterState={initialFilterState}
        filteredProducts={mockFilteredProducts}
        onChange={mockOnChange}
      />
    );

    expect(
      screen.getByRole('heading', { name: /Фильтр/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Цена, ₽/i)).toBeInTheDocument();
    expect(screen.getByText(/Категория/i)).toBeInTheDocument();
    expect(screen.getByText(/Тип камеры/i)).toBeInTheDocument();
    expect(screen.getByText(/Уровень/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Сбросить фильтры/i })
    ).toBeInTheDocument();
  });

  it('should calls onChange with reset parameters when reset button is clicked', () => {
    render(
      <Filter
        filterState={initialFilterState}
        filteredProducts={mockFilteredProducts}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /сбросить фильтры/i }));

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining(initialFilterState),
      expect.arrayContaining([
        { key: 'price', value: null },
        { key: 'priceUp', value: null },
        { key: 'category', value: '' },
        { key: 'type', value: [] },
        { key: 'level', value: [] },
      ])
    );
  });
});
