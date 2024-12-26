import { State } from '../types/state';
import { createApi } from '../services/api';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { Order, Product, Review } from '../types/types';
import { commerce, datatype, helpers, image, lorem, name } from 'faker';
import { FilterOption, NameSpace, RequestStatus } from '../const/const';
import { FilterState } from '../store/filter-slice/filter-slice';

export type AppThunkDispatch = ThunkDispatch<
  State,
  ReturnType<typeof createApi>,
  Action
>;

export const extractActionsTypes = (actions: Action<string>[]) =>
  actions.map(({ type }) => type);

export const getMockProduct = (initial: Partial<Product> = {}): Product => ({
  id: datatype.number(10),
  name: commerce.productName(),
  vendorCode: datatype.uuid(),
  type: helpers.randomize([
    'Цифровая',
    'Плёночная',
    'Моментальная',
    'Коллекционная',
  ]),
  category: helpers.randomize(['Фотоаппарат', 'Видеокамера']),
  description: lorem.paragraph(),
  level: helpers.randomize(['Нулевой', 'Любительский', 'Профессиональный']),
  price: +commerce.price(1990, 199990),
  rating: datatype.number(5),
  reviewCount: datatype.number(10),
  previewImg: image.image(),
  previewImg2x: image.imageUrl(),
  previewImgWebp: image.image(),
  previewImgWebp2x: image.image(),
  ...initial,
});

export const getMockReview = (initial: Partial<Review> = {}): Review => ({
  id: datatype.uuid(),
  createAt: datatype.datetime().toISOString(),
  cameraId: datatype.number(10),
  userName: name.firstName(),
  advantage: lorem.sentence(),
  disadvantage: lorem.sentence(),
  review: lorem.paragraph(),
  rating: datatype.number(5),
  ...initial,
});

export const getMockOrder = (): Order => ({
  camerasIds: [datatype.number(10)],
  coupon: null,
});

export const getMockStore = (initialState?: Partial<State>): State => ({
  [NameSpace.Filter]: {
    sort: FilterOption.sort[0].value,
    order: FilterOption.order[0].value,
    price: null,
    priceUp: null,
    category: '',
    type: [],
    level: [],
    page: null,
    tab: FilterOption.tab[0].value,
  },
  [NameSpace.Products]: {
    allProductsStatus: RequestStatus.Idle,
    allProducts: [],
    productDetailsStatus: RequestStatus.Idle,
    productDetails: null,
    productReviewsStatus: RequestStatus.Idle,
    productReviews: [],
    basket: [],
    postOrderStatus: RequestStatus.Idle,
  },
  ...(initialState ?? {}),
});

export const getMockFilterState = (
  initial: Partial<FilterState> = {}
): FilterState => ({
  sort: FilterOption.sort[0].value,
  order: FilterOption.order[0].value,
  price: null,
  priceUp: null,
  category: '',
  type: [],
  level: [],
  page: null,
  tab: FilterOption.tab[0].value,
  ...initial,
});
