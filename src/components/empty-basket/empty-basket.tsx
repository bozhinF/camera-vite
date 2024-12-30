import { Link } from 'react-router-dom';
import { AppRoute } from '../../const/const';

function EmptyBasket(): JSX.Element {
  return (
    <div className="container">
      <h1 className="title title--h2">Корзина пуста</h1>
      <h1 className="title title--h3">
        Воспользуйтесь поиском, чтобы найти всё, что нужно
      </h1>

      <Link className="btn" to={AppRoute.Main}>
        В каталог
      </Link>
    </div>
  );
}

export default EmptyBasket;
