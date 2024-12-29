import { render, screen, fireEvent } from '@testing-library/react';
import FilterPrice from './filter-price';
import { EventKey } from '../../const/const';
import { getMockFilterState } from '../../util/mocks';

describe('Component: FilterPrice', () => {
  const mockOnChange = vi.fn();
  const allPrices = [100, 200, 300, 400, 500];

  const initialFilterState = getMockFilterState();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders component with initial values', () => {
    const expectPriceText = /Цена, ₽/i;
    const expectFromPlaceholderText = /100/i;
    const expectToPlaceholderText = /500/i;
    const expectInputsValue = null;

    render(
      <FilterPrice
        allPrices={allPrices}
        filterState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(expectPriceText)).toBeInTheDocument();
    const fromInput: HTMLInputElement = screen.getByPlaceholderText(
      expectFromPlaceholderText
    );
    const toInput = screen.getByPlaceholderText(expectToPlaceholderText);

    expect(fromInput).toHaveValue(expectInputsValue);
    expect(toInput).toHaveValue(expectInputsValue);
  });

  it('should calls onChange with correct values when price inputs are changed', () => {
    const expectFromPlaceholderText = /100/i;
    const expectToPlaceholderText = /500/i;
    const inputedFromValue = '200';
    const inputedToValue = '400';
    const expectFromValue = 200;
    const expectToValue = 400;
    const expectFromKey = 'price';
    const expectToKey = 'priceUp';

    render(
      <FilterPrice
        allPrices={allPrices}
        filterState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    const fromInput = screen.getByPlaceholderText(expectFromPlaceholderText);
    const toInput = screen.getByPlaceholderText(expectToPlaceholderText);
    fireEvent.change(fromInput, { target: { value: inputedFromValue } });
    fireEvent.blur(fromInput);
    fireEvent.change(toInput, { target: { value: inputedToValue } });
    fireEvent.blur(toInput);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: expectFromKey, value: expectFromValue },
      { key: expectToKey, value: expectToValue },
    ]);
  });

  it('should limits the prices to the range of allPrices', () => {
    const expectFromPlaceholderText = /100/i;
    const expectToPlaceholderText = /500/i;
    const inputedFromValue = '50';
    const inputedToValue = '600';
    const expectFromValue = 100;
    const expectToValue = 500;
    const expectFromKey = 'price';
    const expectToKey = 'priceUp';

    render(
      <FilterPrice
        allPrices={allPrices}
        filterState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    const fromInput = screen.getByPlaceholderText(expectFromPlaceholderText);
    const toInput = screen.getByPlaceholderText(expectToPlaceholderText);
    fireEvent.change(fromInput, { target: { value: inputedFromValue } });
    fireEvent.blur(fromInput);
    fireEvent.change(toInput, { target: { value: inputedToValue } });
    fireEvent.blur(toInput);

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: expectFromKey, value: expectFromValue },
      { key: expectToKey, value: expectToValue },
    ]);
  });

  it('should handles Enter key for submitting values', () => {
    const expectFromPlaceholderText = /100/i;
    const expectToPlaceholderText = /500/i;
    const inputedFromValue = '250';
    const inputedToValue = '450';
    const expectFromValue = 250;
    const expectToValue = 450;
    const expectFromKey = 'price';
    const expectToKey = 'priceUp';

    render(
      <FilterPrice
        allPrices={allPrices}
        filterState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    const fromInput = screen.getByPlaceholderText(expectFromPlaceholderText);
    const toInput = screen.getByPlaceholderText(expectToPlaceholderText);

    fireEvent.change(fromInput, { target: { value: inputedFromValue } });
    fireEvent.keyDown(fromInput, { key: EventKey.Enter, code: EventKey.Enter });

    fireEvent.change(toInput, { target: { value: inputedToValue } });
    fireEvent.keyDown(toInput, { key: EventKey.Enter, code: EventKey.Enter });

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: expectFromKey, value: expectFromValue },
      { key: expectToKey, value: expectToValue },
    ]);
  });

  it('should handles input blur and sets correct price', () => {
    const expectFromPlaceholderText = /100/i;
    const expectToPlaceholderText = /500/i;
    const inputedFromValue = '300';
    const inputedToValue = '150';
    const expectFromValue = 100;
    const expectToValue = 150;
    const expectFromKey = 'price';
    const expectToKey = 'priceUp';

    render(
      <FilterPrice
        allPrices={allPrices}
        filterState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    const fromInput = screen.getByPlaceholderText(expectFromPlaceholderText);
    const toInput = screen.getByPlaceholderText(expectToPlaceholderText);

    fireEvent.change(fromInput, { target: { value: inputedFromValue } });
    fireEvent.blur(fromInput);

    fireEvent.change(toInput, { target: { value: inputedToValue } });
    fireEvent.blur(toInput);

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: expectFromKey, value: expectFromValue },
      { key: expectToKey, value: expectToValue },
    ]);
  });
});
