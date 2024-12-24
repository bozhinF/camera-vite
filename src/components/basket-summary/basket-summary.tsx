import { RequestStatus } from '../../const/const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getAllProducts,
  getBasket,
  getPostOrderStatus,
} from '../../store/products-slice/selectors';
import { postOrder } from '../../store/products-slice/thunks';
import { Order } from '../../types/types';
import { discountDecreaser, discountIncreaser } from '../../util/util';

function BasketSummary(): JSX.Element {
  const dispatch = useAppDispatch();
  const products = useAppSelector(getAllProducts);
  const basket = useAppSelector(getBasket);
  const allProuductsPrice = basket.reduce((totalPrice, id) => {
    const product = products.find((item) => item.id === id);
    const productPrice = product ? product.price : 0;
    return totalPrice + productPrice;
  }, 0);
  let discountPercent = 0;
  discountPercent = discountIncreaser(basket.length, discountPercent);
  discountPercent = discountDecreaser(allProuductsPrice, discountPercent);
  const discount = (allProuductsPrice * discountPercent) / 100;
  const total = allProuductsPrice - discount;
  const status = useAppSelector(getPostOrderStatus);

  return (
    <div className="basket__summary">
      <div className="basket__promo">
        <p className="title title&#45;&#45;h4">
          Если у вас есть промокод на скидку, примените его в этом поле
        </p>
        <div className="basket-form">
          <form action="#">
            <div className="custom-input">
              <label>
                <span className="custom-input__label">Промокод</span>
                <input
                  type="text"
                  name="promo"
                  placeholder="Введите промокод"
                />
              </label>
              <p className="custom-input__error">Промокод неверный</p>
              <p className="custom-input__success">Промокод принят!</p>
            </div>
            <button className="btn" type="submit">
              Применить
            </button>
          </form>
        </div>
      </div>
      <div className="basket__summary-order">
        <p className="basket__summary-item">
          <span className="basket__summary-text">Всего:</span>
          <span className="basket__summary-value" data-testid={'total'}>
            {allProuductsPrice.toLocaleString('ru')} ₽
          </span>
        </p>
        <p className="basket__summary-item">
          <span className="basket__summary-text">Скидка:</span>
          <span
            className={`basket__summary-value ${
              discount > 0 ? 'basket__summary-value--bonus' : ''
            }`}
            data-testid={'discount'}
          >
            {discount.toLocaleString('ru')} ₽
          </span>
        </p>
        <p className="basket__summary-item">
          <span className="basket__summary-text basket__summary-text--total">
            К оплате:
          </span>
          <span
            className="basket__summary-value basket__summary-value--total"
            data-testid={'paid'}
          >
            {total.toLocaleString('ru')} ₽
          </span>
        </p>
        <button
          className="btn btn--purple"
          type="submit"
          disabled={!basket.length || status === RequestStatus.Loading}
          onClick={() => {
            const order: Order = { camerasIds: basket, coupon: null };
            dispatch(postOrder({ order }));
          }}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
}

export default BasketSummary;
