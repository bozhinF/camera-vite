import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useEffect } from 'react';
import {
  fetchProduct,
  fetchProductReviews,
} from '../../store/products-slice/thunks';
import {
  getProductDetails,
  getProductDetailsStatus,
  getProductReviews,
} from '../../store/products-slice/selectors';
import { RequestStatus } from '../../const/const';
import Loader from '../../components/loader/loader';
import NotFoundPage from '../not-found-page/not-found-page';
import Tabs from '../../components/tabs/tabs';
import Breadcrumbs from '../../components/breadcrumbs/breadcrumbs';
import StarsRating from '../../components/stars-rating/stars-rating';
import ReviewsList from '../../components/reviews-list/reviews-list';

function ProductPage(): JSX.Element {
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct({ id }));
      dispatch(fetchProductReviews({ id }));
    }
  }, [dispatch, id]);

  const productDetails = useAppSelector(getProductDetails);
  const productDetailsStatus = useAppSelector(getProductDetailsStatus);
  const productReviews = useAppSelector(getProductReviews);

  if (
    productDetailsStatus === RequestStatus.Loading ||
    productDetailsStatus === RequestStatus.Idle
  ) {
    return <Loader />;
  }

  if (!productDetails) {
    return <NotFoundPage />;
  }

  const {
    name,
    price,
    rating,
    reviewCount,
    previewImg,
    previewImg2x,
    previewImgWebp,
    previewImgWebp2x,
  } = productDetails;

  return (
    <>
      <main>
        <div className="page-content">
          <Breadcrumbs tip={name} />
          <div className="page-content__section">
            <section className="product">
              <div className="container">
                <div className="product__img">
                  <picture>
                    <source
                      type="image/webp"
                      srcSet={`/${previewImgWebp}, /${previewImgWebp2x} 2x`}
                    />
                    <img
                      src={`/${previewImg}`}
                      srcSet={`/${previewImg2x} 2x`}
                      width={560}
                      height={480}
                      alt={name}
                    />
                  </picture>
                </div>
                <div className="product__content">
                  <h1 className="title title--h3">{name}</h1>
                  <StarsRating rating={rating} reviewCount={reviewCount} />
                  <p className="product__price">
                    <span className="visually-hidden">Цена:</span>
                    {price.toLocaleString('ru')} ₽
                  </p>
                  <button className="btn btn--purple" type="button">
                    <svg width={24} height={16} aria-hidden="true">
                      <use xlinkHref="#icon-add-basket" />
                    </svg>
                    Добавить в корзину
                  </button>
                  <Tabs product={productDetails} />
                </div>
              </div>
            </section>
          </div>
          {/*<div class="page-content__section">
      <section class="product-similar">
        <div class="container">
          <h2 class="title title&#45;&#45;h3">Похожие товары</h2>
          <div class="product-similar__slider">
            <div class="product-similar__slider-list">
              <div class="product-card is-active">
                <div class="product-card__img">
                  <picture>
                    <source type="image/webp" srcset="img/content/fast-shot.webp, img/content/fast-shot@2x.webp 2x"><img src="img/content/fast-shot.jpg" srcset="img/content/fast-shot@2x.jpg 2x" width="280" height="240" alt="Фотоаппарат FastShot MR-5">
                  </picture>
                </div>
                <div class="product-card__info">
                  <div class="rate product-card__rate">
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-star"></use>
                    </svg>
                    <p class="visually-hidden">Рейтинг: 4</p>
                    <p class="rate__count"><span class="visually-hidden">Всего оценок:</span>12</p>
                  </div>
                  <p class="product-card__title">Фотоаппарат FastShot MR-5</p>
                  <p class="product-card__price"><span class="visually-hidden">Цена:</span>18 970 ₽
                  </p>
                </div>
                <div class="product-card__buttons">
                  <button class="btn btn&#45;&#45;purple product-card__btn" type="button">Купить
                  </button>
                  <a class="btn btn&#45;&#45;transparent" href="#">Подробнее
                  </a>
                </div>
              </div>
              <div class="product-card is-active">
                <div class="product-card__img">
                  <picture>
                    <source type="image/webp" srcset="img/content/das-auge.webp, img/content/das-auge@2x.webp 2x"><img src="img/content/das-auge.jpg" srcset="img/content/das-auge@2x.jpg 2x" width="280" height="240" alt="Ретрокамера «Das Auge IV»">
                  </picture>
                </div>
                <div class="product-card__info">
                  <div class="rate product-card__rate">
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-star"></use>
                    </svg>
                    <p class="visually-hidden">Рейтинг: 3</p>
                    <p class="rate__count"><span class="visually-hidden">Всего оценок:</span>23</p>
                  </div>
                  <p class="product-card__title">Ретрокамера «Das Auge IV»</p>
                  <p class="product-card__price"><span class="visually-hidden">Цена:</span>73 450 ₽
                  </p>
                </div>
                <div class="product-card__buttons">
                  <button class="btn btn&#45;&#45;purple product-card__btn" type="button">Купить
                  </button>
                  <a class="btn btn&#45;&#45;transparent" href="#">Подробнее
                  </a>
                </div>
              </div>
              <div class="product-card is-active">
                <div class="product-card__img">
                  <picture>
                    <source type="image/webp" srcset="img/content/instaprinter.webp, img/content/instaprinter@2x.webp 2x"><img src="img/content/instaprinter.jpg" srcset="img/content/instaprinter@2x.jpg 2x" width="280" height="240" alt="Фотоаппарат Instaprinter P2">
                  </picture>
                </div>
                <div class="product-card__info">
                  <div class="rate product-card__rate">
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <p class="visually-hidden">Рейтинг: 5</p>
                    <p class="rate__count"><span class="visually-hidden">Всего оценок:</span>849</p>
                  </div>
                  <p class="product-card__title">Фотоаппарат Instaprinter P2</p>
                  <p class="product-card__price"><span class="visually-hidden">Цена:</span>8 430 ₽
                  </p>
                </div>
                <div class="product-card__buttons">
                  <button class="btn btn&#45;&#45;purple product-card__btn" type="button">Купить
                  </button>
                  <a class="btn btn&#45;&#45;transparent" href="#">Подробнее
                  </a>
                </div>
              </div>
              <div class="product-card">
                <div class="product-card__img">
                  <picture>
                    <source type="image/webp" srcset="img/content/das-auge.webp, img/content/das-auge@2x.webp 2x"><img src="img/content/das-auge.jpg" srcset="img/content/das-auge@2x.jpg 2x" width="280" height="240" alt="Ретрокамера «Das Auge IV»">
                  </picture>
                </div>
                <div class="product-card__info">
                  <div class="rate product-card__rate">
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-star"></use>
                    </svg>
                    <p class="visually-hidden">Рейтинг: 4</p>
                    <p class="rate__count"><span class="visually-hidden">Всего оценок:</span>12</p>
                  </div>
                  <p class="product-card__title">Фотоаппарат FastShot MR-5</p>
                  <p class="product-card__price"><span class="visually-hidden">Цена:</span>18 970 ₽
                  </p>
                </div>
                <div class="product-card__buttons">
                  <button class="btn btn&#45;&#45;purple product-card__btn" type="button">Купить
                  </button>
                  <a class="btn btn&#45;&#45;transparent" href="#">Подробнее
                  </a>
                </div>
              </div>
              <div class="product-card">
                <div class="product-card__img">
                  <picture>
                    <source type="image/webp" srcset="img/content/das-auge.webp, img/content/das-auge@2x.webp 2x"><img src="img/content/das-auge.jpg" srcset="img/content/das-auge@2x.jpg 2x" width="280" height="240" alt="Ретрокамера «Das Auge IV»">
                  </picture>
                </div>
                <div class="product-card__info">
                  <div class="rate product-card__rate">
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-star"></use>
                    </svg>
                    <p class="visually-hidden">Рейтинг: 3</p>
                    <p class="rate__count"><span class="visually-hidden">Всего оценок:</span>23</p>
                  </div>
                  <p class="product-card__title">Ретрокамера «Das Auge IV»</p>
                  <p class="product-card__price"><span class="visually-hidden">Цена:</span>73 450 ₽
                  </p>
                </div>
                <div class="product-card__buttons">
                  <button class="btn btn&#45;&#45;purple product-card__btn" type="button">Купить
                  </button>
                  <a class="btn btn&#45;&#45;transparent" href="#">Подробнее
                  </a>
                </div>
              </div>
              <div class="product-card">
                <div class="product-card__img">
                  <picture>
                    <source type="image/webp" srcset="img/content/instaprinter.webp, img/content/instaprinter@2x.webp 2x"><img src="img/content/instaprinter.jpg" srcset="img/content/instaprinter@2x.jpg 2x" width="280" height="240" alt="Фотоаппарат Instaprinter P2">
                  </picture>
                </div>
                <div class="product-card__info">
                  <div class="rate product-card__rate">
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <svg width="17" height="16" aria-hidden="true">
                      <use xlink:href="#icon-full-star"></use>
                    </svg>
                    <p class="visually-hidden">Рейтинг: 5</p>
                    <p class="rate__count"><span class="visually-hidden">Всего оценок:</span>849</p>
                  </div>
                  <p class="product-card__title">Фотоаппарат Instaprinter P2</p>
                  <p class="product-card__price"><span class="visually-hidden">Цена:</span>8 430 ₽
                  </p>
                </div>
                <div class="product-card__buttons">
                  <button class="btn btn&#45;&#45;purple product-card__btn" type="button">Купить
                  </button>
                  <a class="btn btn&#45;&#45;transparent" href="#">Подробнее
                  </a>
                </div>
              </div>
            </div>
            <button class="slider-controls slider-controls&#45;&#45;prev" type="button" aria-label="Предыдущий слайд" disabled>
              <svg width="7" height="12" aria-hidden="true">
                <use xlink:href="#icon-arrow"></use>
              </svg>
            </button>
            <button class="slider-controls slider-controls&#45;&#45;next" type="button" aria-label="Следующий слайд">
              <svg width="7" height="12" aria-hidden="true">
                <use xlink:href="#icon-arrow"></use>
              </svg>
            </button>
          </div>
        </div>
      </section>
    </div>*/}
          <div className="page-content__section">
            <ReviewsList reviews={productReviews} />
          </div>
        </div>
      </main>
      <a
        className="up-btn"
        href="#header"
        onClick={(event) => {
          event.preventDefault();
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          });
        }}
      >
        <svg width="12" height="18" aria-hidden="true">
          <use xlinkHref="#icon-arrow2"></use>
        </svg>
      </a>
    </>
  );
}

export default ProductPage;
