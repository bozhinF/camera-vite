import { render, screen, fireEvent } from '@testing-library/react';
import { Product } from '../../types/types';
import Tabs from './tabs';
import { getMockFilterState, getMockProduct } from '../../util/mocks';
import { FilterState } from '../../store/filter-slice/filter-slice';

const mockProduct: Product = getMockProduct({
  vendorCode: '12345',
  category: 'Камера',
  type: 'Цифровая',
  level: 'Профессиональный',
  description: 'Описание продукта',
});

const mockFilterState: FilterState = getMockFilterState({
  tab: 'characteristics',
});

const mockOnChange = vi.fn();

describe('Component: Tabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders tabs and displays the correct content', () => {
    render(
      <Tabs
        product={mockProduct}
        filterState={mockFilterState}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Характеристики')).toBeInTheDocument();
    expect(screen.getByText('Описание')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Характеристики' })).toHaveClass(
      'is-active'
    );
    expect(screen.getByRole('button', { name: 'Описание' })).not.toHaveClass(
      'is-active'
    );

    expect(screen.getByText('Артикул:')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.vendorCode)).toBeInTheDocument();
    expect(screen.getByText('Категория:')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText('Тип камеры:')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.type)).toBeInTheDocument();
    expect(screen.getByText('Уровень:')).toBeInTheDocument();
    expect(screen.getByText(mockProduct.level)).toBeInTheDocument();
  });

  it('should changes tab when clicked and calls onChange', () => {
    render(
      <Tabs
        product={mockProduct}
        filterState={mockFilterState}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Описание'));

    expect(screen.getByRole('button', { name: 'Описание' })).toHaveClass(
      'is-active'
    );
    expect(
      screen.getByRole('button', { name: 'Характеристики' })
    ).not.toHaveClass('is-active');

    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();

    expect(mockOnChange).toHaveBeenCalledWith({ ...mockFilterState }, [
      { key: 'tab', value: 'description' },
    ]);
  });

  it('should does not change if tab is already active', () => {
    render(
      <Tabs
        product={mockProduct}
        filterState={mockFilterState}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Характеристики'));

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
