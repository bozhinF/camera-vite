import { Link } from 'react-router-dom';
import { Product } from '../../types/types';
import StarsRating from '../stars-rating/stars-rating';
import { AppRoute } from '../../const/const';
import ProductImage from '../product-image/product-image';

type ProductCardProps = {
  product: Product;
  onBuyButtonClick: (product: Product) => void;
};

enum ImageSize {
  Width = 280,
  Height = 240,
}

function ProductCard({
  product,
  onBuyButtonClick,
}: ProductCardProps): JSX.Element {
  const { id, name, price, rating, reviewCount } = product;

  return (
    <div className="product-card">
      <div className="product-card__img">
        <ProductImage
          image={product}
          size={{ width: ImageSize.Width, height: ImageSize.Height }}
        />
      </div>
      <div className="product-card__info">
        <StarsRating rating={rating} reviewCount={reviewCount} />
        <p className="product-card__title">
          {name} <br />
        </p>
        <p className="product-card__price">
          <span className="visually-hidden">Цена:</span>
          {price.toLocaleString('ru')} ₽
        </p>
      </div>
      <div className="product-card__buttons">
        <button
          onClick={() => onBuyButtonClick(product)}
          className="btn btn--purple product-card__btn"
          type="button"
        >
          Купить
        </button>
        <Link
          className="btn btn--transparent"
          to={`${AppRoute.Product.replace(':id', String(id))}`}
        >
          Подробнее
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
