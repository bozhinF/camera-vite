import { Product } from '../../types/types';
import StarsRating from '../stars-rating/stars-rating';

const mockProduct: Product = {
  id: 1,
  name: 'Ретрокамера Dus Auge lV',
  vendorCode: 'DA4IU67AD5',
  type: 'Коллекционная',
  category: 'Видеокамера',
  description:
    'Немецкий концерн BRW разработал видеокамеру Das Auge IV в начале 80-х годов, однако она до сих пор пользуется популярностью среди коллекционеров и яростных почитателей старинной техники.',
  level: 'Нулевой',
  price: 65000,
  rating: 5,
  reviewCount: 16,
  previewImg: 'img/content/das-auge.jpg',
  previewImg2x: 'img/content/das-auge@2x.jpg',
  previewImgWebp: 'img/content/das-auge.webp',
  previewImgWebp2x: 'img/content/das-auge@2x.webp',
};

type ProductCardProps = {
  product?: Product;
};

function ProductCard({ product = mockProduct }: ProductCardProps): JSX.Element {
  return (
    <div className="product-card">
      <div className="product-card__img">
        <picture>
          <source
            type="image/webp"
            srcSet={`${product.previewImgWebp}, ${product.previewImgWebp2x} 2x`}
          />
          <img
            src={product.previewImg}
            srcSet={`${product.previewImg2x} 2x`}
            width={280}
            height={240}
            alt={product.name}
          />
        </picture>
      </div>
      <div className="product-card__info">
        <StarsRating
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
        <p className="product-card__title">
          {product.name} <br />
        </p>
        <p className="product-card__price">
          <span className="visually-hidden">Цена:</span>
          {product.price.toLocaleString('ru')} ₽
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
