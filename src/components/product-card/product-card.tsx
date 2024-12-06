import { Link } from 'react-router-dom';
import { Product } from '../../types/types';
import StarsRating from '../stars-rating/stars-rating';
import { AppRoute } from '../../const/const';

type ProductCardProps = {
  product: Product;
  onBuyButtonClick: (product: Product) => void;
};

function ProductCard({
  product,
  onBuyButtonClick,
}: ProductCardProps): JSX.Element {
  const {
    id,
    name,
    price,
    rating,
    reviewCount,
    previewImg,
    previewImg2x,
    previewImgWebp,
    previewImgWebp2x,
  } = product;

  return (
    <div className="product-card">
      <div className="product-card__img">
        <picture>
          <source
            type="image/webp"
            srcSet={`/${previewImgWebp}, /${previewImgWebp2x} 2x`}
          />
          <img
            src={`/${previewImg}`}
            srcSet={`/${previewImg2x} 2x`}
            width={280}
            height={240}
            alt={name}
          />
        </picture>
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
