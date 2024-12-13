import { Product } from '../../types/types';

type ProductDescriptionProps = {
  product: Product;
  children?: React.ReactNode;
};

function ProductDescription({
  product,
  children,
}: ProductDescriptionProps): JSX.Element {
  const { name, vendorCode, type, category, level } = product;
  return (
    <div className="basket-item__description">
      <p className="basket-item__title">{name}</p>
      <ul className="basket-item__list">
        <li className="basket-item__list-item">
          <span className="basket-item__article">Артикул:</span>{' '}
          <span className="basket-item__number">{vendorCode}</span>
        </li>
        <li className="basket-item__list-item">
          {`${type} ${
            category === 'Фотоаппарат' ? 'фотокамера' : category.toLowerCase()
          }`}
        </li>
        <li className="basket-item__list-item">{level} уровень</li>
      </ul>
      {children}
    </div>
  );
}

export default ProductDescription;
