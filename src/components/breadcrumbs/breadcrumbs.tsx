import { Link, useLocation } from 'react-router-dom';
import { AppRoute, Crumb } from '../../const/const';
import { capitalize } from '../../util/util';

type BreadcrumbsProps = {
  tip?: string;
};

function Breadcrumbs({ tip }: BreadcrumbsProps): JSX.Element {
  const { pathname } = useLocation();
  const pathnames = pathname.split('/').filter(Boolean);

  return (
    <div className="breadcrumbs">
      <div className="container">
        <ul className="breadcrumbs__list">
          <li className="breadcrumbs__item">
            {pathnames.length ? (
              <Link className="breadcrumbs__link" to={AppRoute.Main}>
                {Crumb.Main}
                <svg width={5} height={8} aria-hidden="true">
                  <use xlinkHref="#icon-arrow-mini" />
                </svg>
              </Link>
            ) : (
              <span className="breadcrumbs__link breadcrumbs__link--active">
                {Crumb.Main}
              </span>
            )}
          </li>
          {pathnames.map((crumb, index) => {
            crumb = capitalize(crumb);
            const isCrumbExist = crumb in Crumb;
            const isLast = index === pathnames.length - 1;
            if (!isCrumbExist && !isLast) {
              return;
            }
            const crumbName =
              crumb in Crumb ? Crumb[crumb as keyof typeof Crumb] : crumb;
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            return (
              <li key={crumb} className="breadcrumbs__item">
                {isLast ? (
                  <span className="breadcrumbs__link breadcrumbs__link--active">
                    {tip ? tip : crumbName}
                  </span>
                ) : (
                  <Link className="breadcrumbs__link" to={routeTo}>
                    {crumbName}
                    <svg width={5} height={8} aria-hidden="true">
                      <use xlinkHref="#icon-arrow-mini" />
                    </svg>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Breadcrumbs;
