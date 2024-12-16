import { useEffect, useState } from 'react';
import BasketItem from '../../components/basket-item/basket-item';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';
import Portal from '../../components/portal/portal';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getAllProducts,
  getBasket,
  getPostOrderStatus,
} from '../../store/products-slice/selectors';
import { Product } from '../../types/types';
import BasketSummary from '../../components/basket-summary/basket-summary';
import RemoveItemModal from '../../components/remove-item-modal/remove-item-modal';
import { RequestStatus } from '../../const/const';
import LoaderSpinner from '../../components/loader-spinner/loader-spinner';
import OrderSuccessModal from '../../components/order-success-modal/order-success-modal';
import SomethingWrongModal from '../../components/something-wrong-modal/something-wrong-modal';
import {
  resetPostOrderStatus,
  updateBasket,
} from '../../store/products-slice/products-slice';

function BasketPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const products = useAppSelector(getAllProducts);
  const basket = useAppSelector(getBasket);
  const uniqueBasket = new Set(basket);

  const [isModalOpen, setModalOpen] = useState(false);
  const [removeItem, setRemoveItem] = useState<Product | null>(null);

  const status = useAppSelector(getPostOrderStatus);

  useEffect(() => {
    if (status === RequestStatus.Loading) {
      setModalOpen(true);
    }
    if (status === RequestStatus.Success) {
      dispatch(updateBasket([]));
    }
  }, [status, dispatch]);

  const handleCloseButtonClick = (product: Product) => {
    setRemoveItem(product);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setRemoveItem(null);
    if (status !== RequestStatus.Idle) {
      dispatch(resetPostOrderStatus());
    }
  };

  return (
    <main>
      {isModalOpen && (
        <Portal
          isOpen={isModalOpen}
          blocked={status === RequestStatus.Loading}
          onModalClose={handleModalClose}
        >
          {status === RequestStatus.Loading ? <LoaderSpinner /> : ''}
          {status === RequestStatus.Success ? (
            <OrderSuccessModal onCloseButtonClick={handleModalClose} />
          ) : (
            ''
          )}
          {status === RequestStatus.Failed ? (
            <SomethingWrongModal onCloseButtonClick={handleModalClose} />
          ) : (
            ''
          )}
          {status === RequestStatus.Idle ? (
            <RemoveItemModal
              removeItem={removeItem}
              onCloseButtonClick={handleModalClose}
            />
          ) : (
            ''
          )}
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
