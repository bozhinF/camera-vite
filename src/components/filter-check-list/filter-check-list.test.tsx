import { render, screen, fireEvent } from '@testing-library/react';
import { FilterOptionsItem } from '../../types/types';
import { FilterState } from '../../store/filter-slice/filter-slice';
import FilterCheckList from './filter-check-list';
import { FilterOption } from '../../const/const';

describe('Component: FilterCheckList', () => {
  const mockOnChange = vi.fn();

  const items: FilterOptionsItem = [
    { id: 'snapshot', title: 'Моментальная', value: 'snapshot' },
    { id: 'film', title: 'Плёночная', value: 'film' },
    { id: 'videocamera', title: 'Видеокамера', value: 'videocamera' },
  ];

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

  it('should renders the title and items', () => {
    render(
      <FilterCheckList
        type="checkbox"
        title="Тип камеры"
        name="type"
        items={items}
        totalState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(/тип камеры/i)).toBeInTheDocument();
    items.forEach((item) => {
      expect(screen.getByLabelText(item.title)).toBeInTheDocument();
    });
  });

  it('should calls onChange with updated value when an item is checked', () => {
    const itemTitle = items[0].title;
    const itemValue = items[0].value;

    render(
      <FilterCheckList
        type="checkbox"
        title="Тип камеры"
        name="type"
        items={items}
        totalState={{ ...initialFilterState, type: [] }}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByLabelText(itemTitle);
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: 'type', value: [itemValue] },
    ]);
  });

  it('should calls onChange with updated value when an item is unchecked', () => {
    const itemTitle = items[0].title;
    const itemValue = items[0].value;
    const modifiedState = { ...initialFilterState, type: [itemValue] };

    render(
      <FilterCheckList
        type="checkbox"
        title="Тип камеры"
        name="type"
        items={items}
        totalState={modifiedState}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByLabelText(itemTitle);
    fireEvent.click(checkbox);

    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: 'type', value: [] },
    ]);
  });

  it('should disables options when videocamera is selected', () => {
    const modifiedState = { ...initialFilterState, category: 'videocamera' };

    render(
      <FilterCheckList
        type="radio"
        title="Тип камеры"
        name="type"
        items={items}
        totalState={modifiedState}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText('Плёночная')).toBeDisabled();
    expect(screen.getByLabelText('Моментальная')).toBeDisabled();
  });
});
