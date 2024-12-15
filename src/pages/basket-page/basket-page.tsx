import { useState } from 'react';
import BasketItem from '../../components/basket-item/basket-item';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';
import Portal from '../../components/portal/portal';
import RemoveItemModal from '../../components/remove-item-modal/remove-item-modal';
import { useAppSelector } from '../../hooks';
import {
  getAllProducts,
  getBasket,
} from '../../store/products-slice/selectors';
import { Product } from '../../types/types';
import BasketSummary from '../../components/basket-summary/basket-summary';

function BasketPage(): JSX.Element {
  const products = useAppSelector(getAllProducts);
  const basket = useAppSelector(getBasket);
  const uniqueBasket = new Set(basket);

  const [isModalOpen, setModalOpen] = useState(false);
  const [removeItem, setRemoveItem] = useState<Product | null>(null);

  const handleCloseButtonClick = (product: Product) => {
    setRemoveItem(product);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setRemoveItem(null);
  };

  return (
    <main>
      {isModalOpen && (
        <Portal isOpen={isModalOpen} onModalClose={handleModalClose}>
          <RemoveItemModal
            removeItem={removeItem}
            onCloseButtonClick={handleModalClose}
          />
        </Portal>
      )}
      <div className="page-content">
        <Breadcrumbs />
        <section className="basket">
          <div className="container">
            <h1 className="title title--h2">Корзина</h1>
            <ul className="basket__list">
              {[...uniqueBasket].map((productId) => {
                const productItem = products.find(
                  (product) => productId === product.id
                );
                const amount = basket.filter((id) => productId === id).length;
                if (productItem) {
                  return (
                    <BasketItem
                      key={productId}
                      product={productItem}
                      amount={amount}
                      onCloseButtonClick={handleCloseButtonClick}
                    />
                  );
                }
              })}
            </ul>
            <BasketSummary />
          </div>
        </section>
      </div>
    </main>
  );
}

export default BasketPage;
