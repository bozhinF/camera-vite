import { Product } from '../../types/types';
import StarsRating from '../stars-rating/stars-rating';

type ProductCardProps = {
  product: Product;
};

function ProductCard({ product }: ProductCardProps): JSX.Element {
  const {
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
            srcSet={`${previewImgWebp}, ${previewImgWebp2x} 2x`}
          />
          <img
            src={previewImg}
            srcSet={`${previewImg2x} 2x`}
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
        <button className="btn btn--purple product-card__btn" type="button">
          Купить
        </button>
        <a className="btn btn--transparent" href="#">
          Подробнее
        </a>
      </div>
    </div>
  );
}

export default ProductCard;
