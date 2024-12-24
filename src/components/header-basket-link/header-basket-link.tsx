import { Link } from 'react-router-dom';
import { AppRoute } from '../../const/const';
import { useAppSelector } from '../../hooks';
import { getBasket } from '../../store/products-slice/selectors';

function HeaderBasketLink(): JSX.Element {
  const basket = useAppSelector(getBasket);
  const basketSize = basket.length;
  return (
    <Link
      className="header__basket-link"
      to={AppRoute.Basket}
      data-testid={'basket-link'}
    >
      <svg width="16" height="16" aria-hidden="true">
        <use xlinkHref="#icon-basket"></use>
      </svg>
      {!!basketSize && (
        <span className="header__basket-count">{basketSize}</span>
      )}
    </Link>
  );
}

export default HeaderBasketLink;
