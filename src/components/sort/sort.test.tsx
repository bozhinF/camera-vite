import { render, screen, fireEvent } from '@testing-library/react';
import { FilterOption } from '../../const/const';
import Sort from './sort';
import { getMockFilterState } from '../../util/mocks';

describe('Component: Sort', () => {
  const mockFilterState = getMockFilterState();

  const mockOnSortChange = vi.fn();

  it('should renders sort options correctly', () => {
    render(
      <Sort filterState={mockFilterState} onSortChange={mockOnSortChange} />
    );

    expect(screen.getByText('Сортировать:')).toBeInTheDocument();

    Object.values(FilterOption.sort).forEach((option) => {
      expect(screen.getByLabelText(option.title)).toBeInTheDocument();
    });

    Object.values(FilterOption.order).forEach((option) => {
      expect(screen.getByLabelText(option.title)).toBeInTheDocument();
    });
  });

  it('should calls onSortChange when a sort option is selected', () => {
    render(
      <Sort filterState={mockFilterState} onSortChange={mockOnSortChange} />
    );

    const sortOption = Object.values(FilterOption.sort)[1];
    fireEvent.click(screen.getByLabelText(sortOption.title));

    expect(mockOnSortChange).toHaveBeenCalledWith({ ...mockFilterState }, [
      { key: 'sort', value: sortOption.value },
    ]);
  });

  it('should calls onSortChange when an order option is selected', () => {
    render(
      <Sort filterState={mockFilterState} onSortChange={mockOnSortChange} />
    );

    const orderOption = Object.values(FilterOption.order)[1];
    fireEvent.click(screen.getByLabelText(orderOption.title));

    expect(mockOnSortChange).toHaveBeenCalledWith({ ...mockFilterState }, [
      { key: 'order', value: orderOption.value },
    ]);
  });

  it('should renders selected sort option as checked', () => {
    render(
      <Sort filterState={mockFilterState} onSortChange={mockOnSortChange} />
    );

    Object.values(FilterOption.sort).forEach((option) => {
      const radio = screen.getByLabelText(option.title);
      expect(radio).toHaveProperty(
        'checked',
        option.value === mockFilterState.sort
      );
    });
  });

  it('should renders selected order option as checked', () => {
    render(
      <Sort filterState={mockFilterState} onSortChange={mockOnSortChange} />
    );

    Object.values(FilterOption.order).forEach((option) => {
      const radio = screen.getByLabelText(option.title);
      expect(radio).toHaveProperty(
        'checked',
        option.value === mockFilterState.order
      );
    });
  });
});
