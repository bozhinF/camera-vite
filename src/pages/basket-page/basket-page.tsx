import { useEffect, useState } from 'react';
import BasketItem from '../../components/basket-item/basket-item';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';
import Portal from '../../components/portal/portal';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getAllProducts,
  getBasket,
  getCouponValidateStatus,
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
  resetCoupon,
  resetPostOrderStatus,
  updateBasket,
} from '../../store/products-slice/products-slice';
import EmptyBasket from '../../components/empty-basket/empty-basket';

function BasketPage(): JSX.Element {
  const dispatch = useAppDispatch();
  const products = useAppSelector(getAllProducts);
  const basket = useAppSelector(getBasket);
  const couponValidateStatus = useAppSelector(getCouponValidateStatus);
  const uniqueBasket = new Set(basket);

  const [isModalOpen, setModalOpen] = useState(false);
  const [removeItem, setRemoveItem] = useState<Product | null>(null);

  const status = useAppSelector(getPostOrderStatus);

  useEffect(() => {
    if (couponValidateStatus !== RequestStatus.Loading) {
      setModalOpen(false);
    }
    if (
      status === RequestStatus.Loading ||
      status === RequestStatus.Success ||
      status === RequestStatus.Failed ||
      couponValidateStatus === RequestStatus.Loading
    ) {
      setModalOpen(true);
    }
    if (status === RequestStatus.Success) {
      dispatch(updateBasket([]));
      dispatch(resetCoupon());
    }
  }, [status, couponValidateStatus, dispatch]);

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

  const handleOrderSuccessModalClose = () => {
    setModalOpen(false);
    setRemoveItem(null);
    if (status !== RequestStatus.Idle) {
      dispatch(resetPostOrderStatus());
    }
    if (couponValidateStatus !== RequestStatus.Idle) {
      dispatch(resetCoupon());
    }
  };

  return (
    <main>
      {isModalOpen && (
        <Portal
          isOpen={isModalOpen}
          blocked={
            status === RequestStatus.Loading ||
            couponValidateStatus === RequestStatus.Loading
          }
          onModalClose={handleModalClose}
        >
          {couponValidateStatus === RequestStatus.Loading ? (
            <LoaderSpinner />
          ) : (
            ''
          )}
          {status === RequestStatus.Loading ? <LoaderSpinner /> : ''}

          {status === RequestStatus.Success ? (
            <OrderSuccessModal
              onCloseButtonClick={handleOrderSuccessModalClose}
            />
          ) : (
            ''
          )}
          {status === RequestStatus.Failed ? (
            <SomethingWrongModal onCloseButtonClick={handleModalClose} />
          ) : (
            ''
          )}
          {status === RequestStatus.Idle &&
          couponValidateStatus !== RequestStatus.Loading ? (
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
          {basket.length ? (
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
          ) : (
            <EmptyBasket />
          )}
        </section>
      </div>
    </main>
  );
}

export default BasketPage;
