import { render, screen, fireEvent } from '@testing-library/react';
import Tabs from './tabs';
import { getMockFilterState, getMockProduct } from '../../util/mocks';
import { ElementRole } from '../../const/const';

const mockProduct = getMockProduct({
  vendorCode: '12345',
  category: 'Камера',
  type: 'Цифровая',
  level: 'Профессиональный',
  description: 'Описание продукта',
});

const mockFilterState = getMockFilterState({
  tab: 'characteristics',
});

const mockOnChange = vi.fn();

describe('Component: Tabs', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders tabs and displays the correct content', () => {
    const expectedCharacteristicsTabText = 'Характеристики';
    const expectedDescriptionTabText = 'Описание';
    const activeTabClass = 'is-active';
    const expectedVendorCodeTitleText = 'Артикул:';
    const expectedCategoryTitleText = 'Категория:';
    const expectedTypeTitleText = 'Тип камеры:';
    const expectedLevelTitleText = 'Уровень:';

    render(
      <Tabs
        product={mockProduct}
        filterState={mockFilterState}
        onChange={mockOnChange}
      />
    );

    expect(
      screen.getByText(expectedCharacteristicsTabText)
    ).toBeInTheDocument();
    expect(screen.getByText(expectedDescriptionTabText)).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, {
        name: expectedCharacteristicsTabText,
      })
    ).toHaveClass(activeTabClass);
    expect(
      screen.getByRole(ElementRole.Button, { name: expectedDescriptionTabText })
    ).not.toHaveClass(activeTabClass);
    expect(screen.getByText(expectedVendorCodeTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.vendorCode)).toBeInTheDocument();
    expect(screen.getByText(expectedCategoryTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.category)).toBeInTheDocument();
    expect(screen.getByText(expectedTypeTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.type)).toBeInTheDocument();
    expect(screen.getByText(expectedLevelTitleText)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.level)).toBeInTheDocument();
  });

  it('should changes tab when clicked and calls onChange', () => {
    const expectedCharacteristicsTabText = 'Характеристики';
    const expectedDescriptionTabText = 'Описание';
    const activeTabClass = 'is-active';
    const expectedUpdateKey = 'tab';
    const expectedUpdateValue = 'description';

    render(
      <Tabs
        product={mockProduct}
        filterState={mockFilterState}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText(expectedDescriptionTabText));
    expect(
      screen.getByRole(ElementRole.Button, { name: expectedDescriptionTabText })
    ).toHaveClass(activeTabClass);
    expect(
      screen.getByRole(ElementRole.Button, {
        name: expectedCharacteristicsTabText,
      })
    ).not.toHaveClass(activeTabClass);
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalledWith({ ...mockFilterState }, [
      { key: expectedUpdateKey, value: expectedUpdateValue },
    ]);
  });

  it('should does not change if tab is already active', () => {
    const expectedCharacteristicsTabText = 'Характеристики';

    render(
      <Tabs
        product={mockProduct}
        filterState={mockFilterState}
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText(expectedCharacteristicsTabText));

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
