import { useState } from 'react';
import { RequestStatus } from '../../const/const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getAllProducts,
  getBasket,
  getCouponDiscount,
  getPostOrderStatus,
} from '../../store/products-slice/selectors';
import { postOrder } from '../../store/products-slice/thunks';
import { Order } from '../../types/types';
import { discountDecreaser, discountIncreaser } from '../../util/util';
import PromoForm from '../promo-form/promo-form';

function BasketSummary(): JSX.Element {
  const dispatch = useAppDispatch();
  const products = useAppSelector(getAllProducts);
  const basket = useAppSelector(getBasket);
  const status = useAppSelector(getPostOrderStatus);
  const couponDiscount = useAppSelector(getCouponDiscount);
  const [coupon, setCoupon] = useState<null | string>(null);
  const allProuductsPrice = basket.reduce((totalPrice, id) => {
    const product = products.find((item) => item.id === id);
    const productPrice = product ? product.price : 0;
    return totalPrice + productPrice;
  }, 0);
  let discountPercent = couponDiscount;
  discountPercent = discountIncreaser(basket.length, discountPercent);
  discountPercent = discountDecreaser(allProuductsPrice, discountPercent);
  const discount = (allProuductsPrice * discountPercent) / 100;
  const total = allProuductsPrice - discount;

  return (
    <div className="basket__summary">
      <div className="basket__promo">
        <p className="title title&#45;&#45;h4">
          Если у вас есть промокод на скидку, примените его в этом поле
        </p>
        <PromoForm onFormSubmit={setCoupon} />
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
            const order: Order = { camerasIds: basket, coupon: coupon };
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
