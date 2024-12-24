import { render, screen, fireEvent } from '@testing-library/react';
import FilterPrice from './filter-price';
import { FilterState } from '../../store/filter-slice/filter-slice';
import { FilterOption } from '../../const/const';

describe('Component: FilterPrice', () => {
  const mockOnChange = vi.fn();
  const allPrices = [100, 200, 300, 400, 500];

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders component with initial values', () => {
    render(
      <FilterPrice
        allPrices={allPrices}
        filterState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/Цена, ₽/i)).toBeInTheDocument();
    const fromInput: HTMLInputElement = screen.getByPlaceholderText(/100/i);
    const toInput = screen.getByPlaceholderText(/500/i);

    expect(fromInput).toHaveValue(null);
    expect(toInput).toHaveValue(null);
  });

  it('should calls onChange with correct values when price inputs are changed', () => {
    render(
      <FilterPrice
        allPrices={allPrices}
        filterState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    const fromInput = screen.getByPlaceholderText(/100/i);
    const toInput = screen.getByPlaceholderText(/500/i);
    fireEvent.change(fromInput, { target: { value: '200' } });
    fireEvent.blur(fromInput);
    fireEvent.change(toInput, { target: { value: '400' } });
    fireEvent.blur(toInput);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: 'price', value: 200 },
      { key: 'priceUp', value: 400 },
    ]);
  });

  it('should limits the prices to the range of allPrices', () => {
    render(
      <FilterPrice
        allPrices={allPrices}
        filterState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    const fromInput = screen.getByPlaceholderText(/100/i);
    const toInput = screen.getByPlaceholderText(/500/i);

    fireEvent.change(fromInput, { target: { value: '50' } });
    fireEvent.blur(fromInput);
    fireEvent.change(toInput, { target: { value: '600' } });
    fireEvent.blur(toInput);

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: 'price', value: 100 },
      { key: 'priceUp', value: 500 },
    ]);
  });

  it('should handles Enter key for submitting values', () => {
    render(
      <FilterPrice
        allPrices={allPrices}
        filterState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    const fromInput = screen.getByPlaceholderText(/100/i);
    const toInput = screen.getByPlaceholderText(/500/i);

    fireEvent.change(fromInput, { target: { value: '250' } });
    fireEvent.keyDown(fromInput, { key: 'Enter', code: 'Enter' });

    fireEvent.change(toInput, { target: { value: '450' } });
    fireEvent.keyDown(toInput, { key: 'Enter', code: 'Enter' });

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: 'price', value: 250 },
      { key: 'priceUp', value: 450 },
    ]);
  });

  it('should handles input blur and sets correct price', () => {
    render(
      <FilterPrice
        allPrices={allPrices}
        filterState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    const fromInput = screen.getByPlaceholderText(/100/i);
    const toInput = screen.getByPlaceholderText(/500/i);

    fireEvent.change(fromInput, { target: { value: '300' } });
    fireEvent.blur(fromInput);

    fireEvent.change(toInput, { target: { value: '150' } });
    fireEvent.blur(toInput);

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: 'price', value: 100 },
      { key: 'priceUp', value: 150 },
    ]);
  });
});
