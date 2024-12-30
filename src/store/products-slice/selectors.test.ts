import { NameSpace, RequestStatus } from '../../const/const';
import { getMockProduct, getMockReview } from '../../util/mocks';
import {
  getAllProducts,
  getAllProductsStatus,
  getBasket,
  getCouponDiscount,
  getCouponValidateStatus,
  getPostOrderStatus,
  getProductDetails,
  getProductDetailsStatus,
  getProductReviews,
} from './selectors';

describe('ProductSlice selectors', () => {
  const mockProducstCount = 5;
  const reviewsCount = 5;
  const products = Array.from({ length: mockProducstCount }, getMockProduct);
  const product = products[0];
  const reviews = Array.from({ length: reviewsCount }, getMockReview);
  const basket = products.map((item) => item.id);
  const state = {
    [NameSpace.Products]: {
      allProductsStatus: RequestStatus.Idle,
      allProducts: products,
      productDetailsStatus: RequestStatus.Idle,
      productDetails: product,
      productReviewsStatus: RequestStatus.Idle,
      productReviews: reviews,
      basket: basket,
      postOrderStatus: RequestStatus.Idle,
      couponDiscount: 0,
      couponValidateStatus: RequestStatus.Idle,
    },
  };

  it('should return allProducts', () => {
    const result = getAllProducts(state);
    expect(result).toEqual(products);
  });

  it('should return allProductsStatus', () => {
    const expectedStatus = state[NameSpace.Products].allProductsStatus;
    const result = getAllProductsStatus(state);
    expect(result).toBe(expectedStatus);
  });

  it('should return allProductsDetails', () => {
    const result = getProductDetails(state);
    expect(result).toEqual(product);
  });

  it('should return productDetailsStatus', () => {
    const expectedStatus = state[NameSpace.Products].productDetailsStatus;
    const result = getProductDetailsStatus(state);
    expect(result).toBe(expectedStatus);
  });

  it('should return productReviews', () => {
    const result = getProductReviews(state);
    expect(result).toEqual(reviews);
  });

  it('should return postOrderStatus', () => {
    const expectedStatus = state[NameSpace.Products].postOrderStatus;
    const result = getPostOrderStatus(state);
    expect(result).toBe(expectedStatus);
  });

  it('should return basket', () => {
    const result = getBasket(state);
    expect(result).toEqual(basket);
  });

  it('should return couponDiscount', () => {
    const expectedResult = 0;
    const result = getCouponDiscount(state);
    expect(result).toEqual(expectedResult);
  });

  it('should return couponValidateStatus', () => {
    const result = getCouponValidateStatus(state);
    expect(result).toEqual(RequestStatus.Idle);
  });
});
