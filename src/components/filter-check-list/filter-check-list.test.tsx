import { render, screen, fireEvent } from '@testing-library/react';
import { FilterOptionsItem } from '../../types/types';
import FilterCheckList from './filter-check-list';
import { getMockFilterState } from '../../util/mocks';

describe('Component: FilterCheckList', () => {
  const mockOnChange = vi.fn();

  const items: FilterOptionsItem = [
    { id: 'snapshot', title: 'Моментальная', value: 'snapshot' },
    { id: 'film', title: 'Плёночная', value: 'film' },
    { id: 'videocamera', title: 'Видеокамера', value: 'videocamera' },
  ];

  const initialFilterState = getMockFilterState();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders the title and items', () => {
    const componentType = 'checkbox';
    const componentTitle = 'Тип камеры';
    const componentName = 'type';
    const expectedText = /тип камеры/i;

    render(
      <FilterCheckList
        type={componentType}
        title={componentTitle}
        name={componentName}
        items={items}
        totalState={initialFilterState}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(expectedText)).toBeInTheDocument();
    items.forEach((item) => {
      expect(screen.getByLabelText(item.title)).toBeInTheDocument();
    });
  });

  it('should calls onChange with updated value when an item is checked', () => {
    const itemTitle = items[0].title;
    const itemValue = items[0].value;
    const componentType = 'checkbox';
    const componentTitle = 'Тип камеры';
    const componentName = 'type';
    const totalState = { ...initialFilterState, type: [] };
    const expectedUpdateKey = 'type';

    render(
      <FilterCheckList
        type={componentType}
        title={componentTitle}
        name={componentName}
        items={items}
        totalState={totalState}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByLabelText(itemTitle);
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: expectedUpdateKey, value: [itemValue] },
    ]);
  });

  it('should calls onChange with updated value when an item is unchecked', () => {
    const itemTitle = items[0].title;
    const itemValue = items[0].value;
    const componentType = 'checkbox';
    const componentTitle = 'Тип камеры';
    const componentName = 'type';
    const modifiedState = { ...initialFilterState, type: [itemValue] };
    const expectedUpdateKey = 'type';

    render(
      <FilterCheckList
        type={componentType}
        title={componentTitle}
        name={componentName}
        items={items}
        totalState={modifiedState}
        onChange={mockOnChange}
      />
    );

    const checkbox = screen.getByLabelText(itemTitle);
    fireEvent.click(checkbox);
    expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object), [
      { key: expectedUpdateKey, value: [] },
    ]);
  });

  it('should disables options when videocamera is selected', () => {
    const componentType = 'checkbox';
    const componentTitle = 'Тип камеры';
    const componentName = 'type';
    const modifiedState = { ...initialFilterState, category: 'videocamera' };
    const filmLabelText = 'Плёночная';
    const snapshotLabelText = 'Моментальная';

    render(
      <FilterCheckList
        type={componentType}
        title={componentTitle}
        name={componentName}
        items={items}
        totalState={modifiedState}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByLabelText(filmLabelText)).toBeDisabled();
    expect(screen.getByLabelText(snapshotLabelText)).toBeDisabled();
  });
});
