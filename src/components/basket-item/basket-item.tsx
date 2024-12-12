import { useState } from 'react';
import { Product } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getBasket } from '../../store/products-slice/selectors';
import { updateBasket } from '../../store/products-slice/products-slice';

type BasketItemProps = {
  product: Product;
  amount: number;
};

enum Quantity {
  Min = 1,
  Max = 9,
}

function BasketItem({ product, amount }: BasketItemProps): JSX.Element {
  const {
    id,
    name,
    vendorCode,
    type,
    category,
    level,
    price,
    previewImg,
    previewImg2x,
    previewImgWebp,
    previewImgWebp2x,
  } = product;

  const dispatch = useAppDispatch();
  const basket = useAppSelector(getBasket);

  const [quantity, setQuantity] = useState<number>(amount);

  const handlePrevButtonClick = () =>
    setQuantity((prev) => (prev <= Quantity.Min ? prev : prev - 1));
  const handleNextButtonClick = () =>
    setQuantity((prev) => (prev >= Quantity.Max ? prev : prev + 1));

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (
      !isNaN(+event.key) &&
      +event.key >= Quantity.Min &&
      +event.key <= Quantity.Max
    ) {
      event.preventDefault();
      setQuantity(+event.key);
    }
  };

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (isNaN(+event.target.value)) {
      return;
    }
    setQuantity(() => {
      if (+event.target.value > Quantity.Max) {
        return Quantity.Max;
      }
      if (+event.target.value < Quantity.Min) {
        return Quantity.Min;
      }
      return Math.round(+event.target.value);
    });
  };

  return (
    <li className="basket-item">
      <div className="basket-item__img">
        <picture>
          <source
            type="image/webp"
            srcSet={`/${previewImgWebp}, /${previewImgWebp2x} 2x`}
          />
          <img
            src={`/${previewImg}`}
            srcSet={`/${previewImg2x} 2x`}
            width={140}
            height={120}
            alt={name}
          />
        </picture>
      </div>
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
      </div>
      <p className="basket-item__price">
        <span className="visually-hidden">Цена:</span>
        {price.toLocaleString('ru')} ₽
      </p>
      <div className="quantity">
        <button
          className="btn-icon btn-icon--prev"
          aria-label="уменьшить количество товара"
          onClick={handlePrevButtonClick}
        >
          <svg width={7} height={12} aria-hidden="true">
            <use xlinkHref="#icon-arrow" />
          </svg>
        </button>
        <label className="visually-hidden" htmlFor="counter1" />
        <input
          type="number"
          id="counter1"
          value={quantity}
          onKeyDown={handleInputKeyDown}
          onChange={handleInputChange}
          min={Quantity.Min}
          max={Quantity.Max}
          aria-label="количество товара"
        />
        <button
          className="btn-icon btn-icon--next"
          aria-label="увеличить количество товара"
          onClick={handleNextButtonClick}
        >
          <svg width={7} height={12} aria-hidden="true">
            <use xlinkHref="#icon-arrow" />
          </svg>
        </button>
      </div>
      <div className="basket-item__total-price">
        <span className="visually-hidden">Общая цена:</span>
        {(quantity * price).toLocaleString()} ₽
      </div>
      <button
        className="cross-btn"
        type="button"
        aria-label="Удалить товар"
        onClick={() => {
          const update = [...basket].filter((productId) => productId !== id);
          dispatch(updateBasket(update));
        }}
      >
        <svg width={10} height={10} aria-hidden="true">
          <use xlinkHref="#icon-close" />
        </svg>
      </button>
    </li>
  );
}

export default BasketItem;
