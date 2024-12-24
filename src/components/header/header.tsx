import { Link } from 'react-router-dom';
import FormSearch from '../form-search/form-search';
import HeaderBasketLink from '../header-basket-link/header-basket-link';
import { AppRoute } from '../../const/const';

function Header(): JSX.Element {
  return (
    <header className="header" id="header">
      <div className="container">
        <Link
          className="header__logo"
          to={AppRoute.Main}
          aria-label="Переход на главную"
        >
          <svg width={100} height={36} aria-hidden="true">
            <use xlinkHref="#icon-logo" />
          </svg>
        </Link>
        <nav className="main-nav header__main-nav">
          <ul className="main-nav__list">
            <li className="main-nav__item">
              <Link className="main-nav__link" to={AppRoute.Catalog}>
                Каталог
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className="main-nav__link" to="#">
                Гарантии
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className="main-nav__link" to="#">
                Доставка
              </Link>
            </li>
            <li className="main-nav__item">
              <Link className="main-nav__link" to="#">
                О компании
              </Link>
            </li>
          </ul>
        </nav>
        <FormSearch />
        <HeaderBasketLink />
      </div>
    </header>
  );
}

export default Header;
