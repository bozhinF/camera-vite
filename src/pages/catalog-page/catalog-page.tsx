import { useState } from 'react';
import Banner from '../../components/banner/banner';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';
import ProductCard from '../../components/product-card/product-card';
import { useAppSelector } from '../../hooks';
import { getAllProducts } from '../../store/products-slice/selectors';
import Portal from '../../components/portal/portal';
import CallItemModal from '../../components/call-item-modal/call-item-modal';
import { Product } from '../../types/types';
import { Helmet } from 'react-helmet-async';
import Sort from '../../components/sort/sort';

function CatalogPage(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [callItem, setCallItem] = useState<Product | null>(null);
  const products = useAppSelector(getAllProducts);

  const handleBuyButtonClick = (product: Product) => {
    setIsModalOpen(true);
    setCallItem(product);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCallItem(null);
  };

  return (
    <main>
      <Helmet>
        <title>Каталог - Фотошоп</title>
      </Helmet>
      {isModalOpen && (
        <Portal isOpen={isModalOpen} onModalClose={handleModalClose}>
          <CallItemModal
            callItem={callItem}
            onCloseButtonClick={handleModalClose}
          />
        </Portal>
      )}

      <Banner />
      <div className="page-content">
        <Breadcrumbs />
        <section className="catalog">
          <div className="container">
            <h1 className="title title--h2">Каталог фото- и видеотехники</h1>
            <div className="page-content__columns">
              <div className="catalog__aside">
                <img src="img/banner.png" />
                {/*<div class="catalog-filter">
              <form action="#">
                <h2 class="visually-hidden">Фильтр</h2>
                <fieldset class="catalog-filter__block">
                  <legend class="title title&#45;&#45;h5">Цена, ₽</legend>
                  <div class="catalog-filter__price-range">
                    <div class="custom-input">
                      <label>
                        <input type="number" name="price" placeholder="от">
                      </label>
                    </div>
                    <div class="custom-input">
                      <label>
                        <input type="number" name="priceUp" placeholder="до">
                      </label>
                    </div>
                  </div>
                </fieldset>
                <fieldset class="catalog-filter__block">
                  <legend class="title title&#45;&#45;h5">Категория</legend>
                  <div class="custom-radio catalog-filter__item">
                    <label>
                      <input type="radio" name="category" value="photocamera" checked><span class="custom-radio__icon"></span><span class="custom-radio__label">Фотокамера</span>
                    </label>
                  </div>
                  <div class="custom-radio catalog-filter__item">
                    <label>
                      <input type="radio" name="category" value="videocamera"><span class="custom-radio__icon"></span><span class="custom-radio__label">Видеокамера</span>
                    </label>
                  </div>
                </fieldset>
                <fieldset class="catalog-filter__block">
                  <legend class="title title&#45;&#45;h5">Тип камеры</legend>
                  <div class="custom-checkbox catalog-filter__item">
                    <label>
                      <input type="checkbox" name="digital" checked><span class="custom-checkbox__icon"></span><span class="custom-checkbox__label">Цифровая</span>
                    </label>
                  </div>
                  <div class="custom-checkbox catalog-filter__item">
                    <label>
                      <input type="checkbox" name="film" disabled><span class="custom-checkbox__icon"></span><span class="custom-checkbox__label">Плёночная</span>
                    </label>
                  </div>
                  <div class="custom-checkbox catalog-filter__item">
                    <label>
                      <input type="checkbox" name="snapshot"><span class="custom-checkbox__icon"></span><span class="custom-checkbox__label">Моментальная</span>
                    </label>
                  </div>
                  <div class="custom-checkbox catalog-filter__item">
                    <label>
                      <input type="checkbox" name="collection" checked disabled><span class="custom-checkbox__icon"></span><span class="custom-checkbox__label">Коллекционная</span>
                    </label>
                  </div>
                </fieldset>
                <fieldset class="catalog-filter__block">
                  <legend class="title title&#45;&#45;h5">Уровень</legend>
                  <div class="custom-checkbox catalog-filter__item">
                    <label>
                      <input type="checkbox" name="zero" checked><span class="custom-checkbox__icon"></span><span class="custom-checkbox__label">Нулевой</span>
                    </label>
                  </div>
                  <div class="custom-checkbox catalog-filter__item">
                    <label>
                      <input type="checkbox" name="non-professional"><span class="custom-checkbox__icon"></span><span class="custom-checkbox__label">Любительский</span>
                    </label>
                  </div>
                  <div class="custom-checkbox catalog-filter__item">
                    <label>
                      <input type="checkbox" name="professional"><span class="custom-checkbox__icon"></span><span class="custom-checkbox__label">Профессиональный</span>
                    </label>
                  </div>
                </fieldset>
                <button class="btn catalog-filter__reset-btn" type="reset">Сбросить фильтры
                </button>
              </form>
            </div>*/}
              </div>
              <div className="catalog__content">
                <Sort />
                <div className="cards catalog__cards">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onBuyButtonClick={handleBuyButtonClick}
                    />
                  ))}
                </div>
                {/*<div class="pagination">
              <ul class="pagination__list">
                <li class="pagination__item"><a class="pagination__link pagination__link&#45;&#45;active" href="1">1</a>
                </li>
                <li class="pagination__item"><a class="pagination__link" href="2">2</a>
                </li>
                <li class="pagination__item"><a class="pagination__link" href="3">3</a>
                </li>
                <li class="pagination__item"><a class="pagination__link pagination__link&#45;&#45;text" href="2">Далее</a>
                </li>
              </ul>
            </div>*/}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CatalogPage;
