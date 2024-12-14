import { useState } from 'react';
import { Product } from '../../types/types';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getBasket } from '../../store/products-slice/selectors';
import {
  addItemToBasket,
  removeItemFromBasket,
  updateBasket,
} from '../../store/products-slice/products-slice';
import ProductImage from '../product-image/product-image';
import ProductDescription from '../product-description/product-description';
import ProductPrice from '../product-price/product-price';
import CloseButton from '../close-button/close-button';

const CLOSE_BUTTON_LABEL = 'Удалить товар';

enum Quantity {
  Min = 1,
  Max = 9,
}

type BasketItemProps = {
  product: Product;
  amount: number;
};

function BasketItem({ product, amount }: BasketItemProps): JSX.Element {
  const { id, price } = product;

  const dispatch = useAppDispatch();
  const basket = useAppSelector(getBasket);

  const [quantity, setQuantity] = useState<number>(amount);

  const handlePrevButtonClick = () => {
    setQuantity((prev) => (prev <= Quantity.Min ? prev : prev - 1));
    if (quantity > Quantity.Min) {
      dispatch(removeItemFromBasket(id));
    }
  };
  const handleNextButtonClick = () => {
    setQuantity((prev) => (prev >= Quantity.Max ? prev : prev + 1));
    if (quantity < Quantity.Max) {
      dispatch(addItemToBasket(id));
    }
  };

  const handleCloseButtonClick = () => {
    const update = [...basket].filter((productId) => productId !== id);
    dispatch(updateBasket(update));
  };

  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    const input = +event.key;
    if (!isNaN(input) && input >= Quantity.Min && input <= Quantity.Max) {
      event.preventDefault();
      if (input !== quantity) {
        setQuantity(input);
        const index = basket.indexOf(id);
        if (index === -1) {
          return;
        }
        const update = [
          ...basket.slice(0, index),
          ...Array.from({ length: input }, () => id),
          ...basket.slice(index + 1).filter((productId) => productId !== id),
        ];
        dispatch(updateBasket(update));
      }
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
        <ProductImage image={product} />
      </div>
      <ProductDescription product={product} />
      <ProductPrice product={product} />
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
      <CloseButton
        label={CLOSE_BUTTON_LABEL}
        onClick={handleCloseButtonClick}
      />
    </li>
  );
}

export default BasketItem;
