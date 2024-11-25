import { useEffect } from 'react';
import { FilterState } from '../../store/filter-slice/filter-slice';
import { HandleFilterChange } from '../../types/types';

type PaginationProps = {
  currentPage: number;
  countPages: number;
  filterState: FilterState;
  onChange: HandleFilterChange;
};

const MAX_RENDERED_PAGES_COUNT = 3;

function Pagination({
  currentPage,
  countPages,
  filterState,
  onChange,
}: PaginationProps): JSX.Element {
  const startPage =
    Math.ceil(currentPage / MAX_RENDERED_PAGES_COUNT) *
      MAX_RENDERED_PAGES_COUNT -
    MAX_RENDERED_PAGES_COUNT +
    1;
  const renderedPagesCount = Math.min(
    countPages - startPage + 1,
    MAX_RENDERED_PAGES_COUNT
  );
  const pages = Array.from(
    { length: renderedPagesCount },
    (_, i) => i + startPage
  );

  const handlePageClick: React.MouseEventHandler<HTMLUListElement> = (
    event
  ) => {
    event.preventDefault();
    const element = event.target as HTMLElement;
    if (element.classList.contains('pagination__link')) {
      const link = element as HTMLAnchorElement;
      const pageNumber = link.pathname.slice(1);
      if (pageNumber !== String(currentPage)) {
        onChange({ ...filterState }, [{ key: 'page', value: +pageNumber }]);
      }
    }
  };

  useEffect(() => {
    if (currentPage > countPages && countPages > 0) {
      onChange({ ...filterState }, [{ key: 'page', value: countPages }]);
    }
  });

  return (
    <div className="pagination">
      <ul className="pagination__list" onClick={handlePageClick}>
        {startPage > MAX_RENDERED_PAGES_COUNT && (
          <li className="pagination__item">
            <a
              className="pagination__link pagination__link--text"
              href={String(startPage - 1)}
            >
              Назад
            </a>
          </li>
        )}

        {pages.length > 1
          ? pages.map((item) => (
            <li key={item} className="pagination__item">
              <a
                className={`pagination__link${
                  item === currentPage ? ' pagination__link--active' : ''
                }`}
                href={String(item)}
              >
                {item}
              </a>
            </li>
          ))
          : ''}
        {pages[pages.length - 1] < countPages && (
          <li className="pagination__item">
            <a
              className="pagination__link pagination__link--text"
              href={String(pages[pages.length - 1] + 1)}
            >
              Далее
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Pagination;
