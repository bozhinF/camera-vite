import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './pagination';
import { createMemoryHistory, MemoryHistory } from 'history';
import { withHistory, withStore } from '../../util/mock-component';
import { getMockStore } from '../../util/mocks';
import { AppRoute, FilterOption } from '../../const/const';

describe('Component: Pagination', () => {
  let mockHistory: MemoryHistory;
  const mockOnChange = vi.fn();
  const initialState = {
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
    mockHistory = createMemoryHistory();
  });

  it('should renders correct number of page links', () => {
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={2}
        countPages={5}
        filterState={initialState}
        onChange={mockOnChange}
      />,
      mockHistory
    );
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const pageLinks = screen.getAllByRole('link', { name: /\d+/ });
    expect(pageLinks).toHaveLength(3);
  });

  it('should renders "Назад" link when necessary', () => {
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={4}
        countPages={10}
        filterState={initialState}
        onChange={mockOnChange}
      />,
      mockHistory
    );
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const backLink = screen.getByText('Назад');
    expect(backLink).toBeInTheDocument();
  });

  it('should does not render "Назад" link when not necessary', () => {
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={1}
        countPages={5}
        filterState={initialState}
        onChange={mockOnChange}
      />,
      mockHistory
    );
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const backLink = screen.queryByText('Назад');
    expect(backLink).not.toBeInTheDocument();
  });

  it('should renders "Далее" link when necessary', () => {
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={3}
        countPages={5}
        filterState={initialState}
        onChange={mockOnChange}
      />,
      mockHistory
    );
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const nextLink = screen.getByText('Далее');
    expect(nextLink).toBeInTheDocument();
  });

  it('should does not render "Далее" link when not necessary', () => {
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={5}
        countPages={5}
        filterState={initialState}
        onChange={mockOnChange}
      />,
      mockHistory
    );
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const nextLink = screen.queryByText('Далее');
    expect(nextLink).not.toBeInTheDocument();
  });

  it('should calls onChange with correct page number when a page link is clicked', () => {
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={2}
        countPages={5}
        filterState={initialState}
        onChange={mockOnChange}
      />,
      mockHistory
    );
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const pageLink = screen.getByText('3');
    fireEvent.click(pageLink);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining(initialState),
      [{ key: 'page', value: 3 }]
    );
  });

  it('should does not call onChange when the current page is clicked', () => {
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={2}
        countPages={5}
        filterState={initialState}
        onChange={mockOnChange}
      />,
      mockHistory
    );
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const currentPageLink = screen.getByText('2');
    fireEvent.click(currentPageLink);

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
