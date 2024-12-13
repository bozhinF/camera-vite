import { Product } from '../../types/types';

type ProductPriceProps = {
  product: Product;
};

function ProductPrice({ product }: ProductPriceProps): JSX.Element {
  const { price } = product;
  return (
    <p className="basket-item__price">
      <span className="visually-hidden">Цена:</span>
      {price.toLocaleString('ru')} ₽
    </p>
  );
}

export default ProductPrice;
