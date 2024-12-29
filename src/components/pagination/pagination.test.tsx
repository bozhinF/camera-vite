import { render, screen, fireEvent } from '@testing-library/react';
import Pagination from './pagination';
import { createMemoryHistory, MemoryHistory } from 'history';
import { withHistory, withStore } from '../../util/mock-component';
import { getMockFilterState, getMockStore } from '../../util/mocks';
import { AppRoute, ElementRole } from '../../const/const';

describe('Component: Pagination', () => {
  let mockHistory: MemoryHistory;
  const mockOnChange = vi.fn();
  const initialState = getMockFilterState();

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders correct number of page links', () => {
    const currentPage = 2;
    const countPages = 5;
    const anyNumber = /\d+/;
    const expectedPageLinksCount = 3;
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={currentPage}
        countPages={countPages}
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

    const pageLinks = screen.getAllByRole(ElementRole.Link, {
      name: anyNumber,
    });
    expect(pageLinks).toHaveLength(expectedPageLinksCount);
  });

  it('should renders "Назад" link when necessary', () => {
    const currentPage = 4;
    const countPages = 10;
    const expectedBackLinkText = 'Назад';
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={currentPage}
        countPages={countPages}
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

    const backLink = screen.getByText(expectedBackLinkText);
    expect(backLink).toBeInTheDocument();
  });

  it('should does not render "Назад" link when not necessary', () => {
    const currentPage = 1;
    const countPages = 5;
    const notExpectedBackLinkText = 'Назад';
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={currentPage}
        countPages={countPages}
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

    const backLink = screen.queryByText(notExpectedBackLinkText);
    expect(backLink).not.toBeInTheDocument();
  });

  it('should renders "Далее" link when necessary', () => {
    const currentPage = 3;
    const countPages = 5;
    const expectedNextLinkText = 'Далее';
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={currentPage}
        countPages={countPages}
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

    const nextLink = screen.getByText(expectedNextLinkText);
    expect(nextLink).toBeInTheDocument();
  });

  it('should does not render "Далее" link when not necessary', () => {
    const currentPage = 5;
    const countPages = 5;
    const notExpectedNextLinkText = 'Далее';
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={currentPage}
        countPages={countPages}
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

    const nextLink = screen.queryByText(notExpectedNextLinkText);
    expect(nextLink).not.toBeInTheDocument();
  });

  it('should calls onChange with correct page number when a page link is clicked', () => {
    const currentPage = 2;
    const countPages = 5;
    const clickedPageLinkText = '3';
    const expectedMockOnChangeCalledWithUpdate = [{ key: 'page', value: 3 }];
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={currentPage}
        countPages={countPages}
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

    const pageLink = screen.getByText(clickedPageLinkText);
    fireEvent.click(pageLink);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining(initialState),
      expectedMockOnChangeCalledWithUpdate
    );
  });

  it('should does not call onChange when the current page is clicked', () => {
    const currentPage = 2;
    const countPages = 5;
    const clickedPageLinkText = '2';
    const withHistoryComponent = withHistory(
      <Pagination
        currentPage={currentPage}
        countPages={countPages}
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

    const currentPageLink = screen.getByText(clickedPageLinkText);
    fireEvent.click(currentPageLink);
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
