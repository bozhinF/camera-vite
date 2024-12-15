import { useAppSelector } from '../../hooks';
import {
  getAllProducts,
  getBasket,
} from '../../store/products-slice/selectors';
import { discountDecreaser, discountIncreaser } from '../../util/util';

function BasketSummary(): JSX.Element {
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

  return (
    <div className="basket__summary">
      <div className="basket__promo">
        {/*<p class="title title&#45;&#45;h4">Если у вас есть промокод на скидку, примените его в этом поле</p>
            <div class="basket-form">
              <form action="#">
                <div class="custom-input">
                  <label><span class="custom-input__label">Промокод</span>
                    <input type="text" name="promo" placeholder="Введите промокод">
                  </label>
                  <p class="custom-input__error">Промокод неверный</p>
                  <p class="custom-input__success">Промокод принят!</p>
                </div>
                <button class="btn" type="submit">Применить
                </button>
              </form>
            </div>*/}
      </div>
      <div className="basket__summary-order">
        <p className="basket__summary-item">
          <span className="basket__summary-text">Всего:</span>
          <span className="basket__summary-value">
            {allProuductsPrice.toLocaleString('ru')} ₽
          </span>
        </p>
        <p className="basket__summary-item">
          <span className="basket__summary-text">Скидка:</span>
          <span
            className={`basket__summary-value ${
              discount > 0 ? 'basket__summary-value--bonus' : ''
            }`}
          >
            {discount.toLocaleString('ru')} ₽
          </span>
        </p>
        <p className="basket__summary-item">
          <span className="basket__summary-text basket__summary-text--total">
            К оплате:
          </span>
          <span className="basket__summary-value basket__summary-value--total">
            {total.toLocaleString('ru')} ₽
          </span>
        </p>
        <button className="btn btn--purple" type="submit">
          Оформить заказ
        </button>
      </div>
    </div>
  );
}

export default BasketSummary;
