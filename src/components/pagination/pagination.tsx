import { UpdateUrl } from '../../types/types';

type PaginationProps = {
  currentPage: number;
  countPages: number;
  onChange: UpdateUrl;
};

function Pagination({
  currentPage,
  countPages,
  onChange,
}: PaginationProps): JSX.Element {
  const maxRenderedPagesCount = 3;
  const startPage =
    Math.ceil(currentPage / maxRenderedPagesCount) * maxRenderedPagesCount -
    maxRenderedPagesCount +
    1;
  const renderedPagesCount = Math.min(
    countPages - startPage + 1,
    maxRenderedPagesCount
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
        onChange([{ param: 'page', prop: pageNumber, action: 'set' }]);
      }
    }
  };

  return (
    <div className="pagination">
      <ul className="pagination__list" onClick={handlePageClick}>
        {startPage > maxRenderedPagesCount && (
          <li className="pagination__item">
            <a
              className="pagination__link pagination__link--text"
              href={String(startPage - 1)}
            >
              Назад
            </a>
          </li>
        )}

        {pages.map((item) => (
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
        ))}
        {/* <li className="pagination__item">
          <a className="pagination__link pagination__link--active" href="1">
            1
          </a>
        </li>
        <li className="pagination__item">
          <a className="pagination__link" href="2">
            2
          </a>
        </li>
        <li className="pagination__item">
          <a className="pagination__link" href="3">
            3
          </a>
        </li> */}
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
