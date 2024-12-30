import { RequestStatus } from '../../const/const';
import { getMockProduct, getMockReview } from '../../util/mocks';
import {
  addItemToBasket,
  productsSlice,
  removeItemFromBasket,
  resetCoupon,
  resetPostOrderStatus,
  setBasket,
  updateBasket,
} from './products-slice';
import {
  fetchAllProducts,
  fetchProduct,
  fetchProductReviews,
  postCoupon,
  postOrder,
} from './thunks';
import * as basketStorage from '../../services/basket';

describe('Products Slice', () => {
  const emptyAction = { type: '' };
  const products = Array.from({ length: 5 }, () => getMockProduct());
  const initialState = {
    allProductsStatus: RequestStatus.Idle,
    allProducts: [],
    productDetailsStatus: RequestStatus.Idle,
    productDetails: null,
    productReviewsStatus: RequestStatus.Idle,
    productReviews: [],
    basket: [],
    postOrderStatus: RequestStatus.Idle,
    couponDiscount: 0,
    couponValidateStatus: RequestStatus.Idle,
  };

  it('should return initial state with empty action', () => {
    const result = productsSlice.reducer(initialState, emptyAction);
    expect(result).toEqual(initialState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const result = productsSlice.reducer(undefined, emptyAction);
    expect(result).toEqual(initialState);
  });

  it('should set "allProductsStatus" to "Loading" with "fetchAllProducts.pending"', () => {
    const expectedState = {
      ...initialState,
      allProductsStatus: RequestStatus.Loading,
    };
    const result = productsSlice.reducer(undefined, fetchAllProducts.pending);
    expect(result).toEqual(expectedState);
  });

  it('should set "allProductsStatus" to "Failed" with "fetchAllProducts.rejected"', () => {
    const expectedState = {
      ...initialState,
      allProductsStatus: RequestStatus.Failed,
    };
    const result = productsSlice.reducer(undefined, fetchAllProducts.rejected);
    expect(result).toEqual(expectedState);
  });

  it('should set "allProductsStatus" to "Success" and set "allProducts" to array with products with "fetchAllProducts.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      allProductsStatus: RequestStatus.Success,
      allProducts: products,
    };
    const result = productsSlice.reducer(
      undefined,
      fetchAllProducts.fulfilled(products, '', undefined)
    );
    expect(result).toEqual(expectedState);
  });

  it('should set "productDetailsStatus" to "Loading" with "fetchProduct.pending"', () => {
    const expectedState = {
      ...initialState,
      productDetailsStatus: RequestStatus.Loading,
    };
    const result = productsSlice.reducer(undefined, fetchProduct.pending);
    expect(result).toEqual(expectedState);
  });

  it('should set "productDetailsStatus" to "Failed" with "fetchProduct.rejected"', () => {
    const expectedState = {
      ...initialState,
      productDetailsStatus: RequestStatus.Failed,
    };
    const result = productsSlice.reducer(undefined, fetchProduct.rejected);
    expect(result).toEqual(expectedState);
  });

  it('should set "productDetailsStatus" to "Success" and set "productDetails" to product with "fetchProduct.fulfilled"', () => {
    const product = products[0];
    const id = product.id.toString();
    const expectedState = {
      ...initialState,
      productDetailsStatus: RequestStatus.Success,
      productDetails: product,
    };
    const result = productsSlice.reducer(
      undefined,
      fetchProduct.fulfilled(product, '', { id })
    );
    expect(result).toEqual(expectedState);
  });

  it('should set "productReviewsStatus" to "Loading" with "fetchProductReviews.pending"', () => {
    const expectedState = {
      ...initialState,
      productReviewsStatus: RequestStatus.Loading,
    };
    const result = productsSlice.reducer(
      undefined,
      fetchProductReviews.pending
    );
    expect(result).toEqual(expectedState);
  });

  it('should set "productReviewsStatus" to "Failed" with "fetchProductReviews.rejected"', () => {
    const expectedState = {
      ...initialState,
      productReviewsStatus: RequestStatus.Failed,
    };
    const result = productsSlice.reducer(
      undefined,
      fetchProductReviews.rejected
    );
    expect(result).toEqual(expectedState);
  });

  it('should set "productReviewsStatus" to "Success" and set "productReviews" to array with reviews with "fetchProductReviews.fulfilled"', () => {
    const reviewsCount = 5;
    const reviews = Array.from({ length: reviewsCount }, getMockReview);
    const expectedState = {
      ...initialState,
      productReviewsStatus: RequestStatus.Success,
      productReviews: reviews,
    };
    const result = productsSlice.reducer(
      undefined,
      fetchProductReviews.fulfilled(reviews, '', { id: '1' })
    );
    expect(result).toEqual(expectedState);
  });

  it('should set "postOrderStatus" to "Loading" with "postOrder.pending"', () => {
    const expectedState = {
      ...initialState,
      postOrderStatus: RequestStatus.Loading,
    };
    const result = productsSlice.reducer(undefined, postOrder.pending);
    expect(result).toEqual(expectedState);
  });

  it('should set "postOrderStatus" to "Failed" with "postOrder.rejected"', () => {
    const expectedState = {
      ...initialState,
      postOrderStatus: RequestStatus.Failed,
    };
    const result = productsSlice.reducer(undefined, postOrder.rejected);
    expect(result).toEqual(expectedState);
  });

  it('should set "postOrderStatus" to "Success" with "postOrder.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      postOrderStatus: RequestStatus.Success,
    };
    const result = productsSlice.reducer(undefined, postOrder.fulfilled);
    expect(result).toEqual(expectedState);
  });

  it('should set "couponValidateStatus" to "Loading" with "postCoupon.pending"', () => {
    const expectedState = {
      ...initialState,
      couponValidateStatus: RequestStatus.Loading,
    };
    const result = productsSlice.reducer(undefined, postCoupon.pending);
    expect(result).toEqual(expectedState);
  });

  it('should set "couponValidateStatus" to "Failed" with "postCoupon.rejected"', () => {
    const expectedState = {
      ...initialState,
      couponValidateStatus: RequestStatus.Failed,
    };
    const result = productsSlice.reducer(undefined, postCoupon.rejected);
    expect(result).toEqual(expectedState);
  });

  it('should set "couponValidateStatus" to "Success" with "postCoupon.fulfilled"', () => {
    const expectedState = {
      ...initialState,
      couponDiscount: 15,
      couponValidateStatus: RequestStatus.Success,
    };
    const result = productsSlice.reducer(
      undefined,
      postCoupon.fulfilled(15, '', { coupon: '15' })
    );
    expect(result).toEqual(expectedState);
  });

  it('should update basket with "updateBasket" action', () => {
    const basket = products.map((item) => item.id);
    const expectedState = {
      ...initialState,
      basket,
    };
    const result = productsSlice.reducer(undefined, updateBasket(basket));
    expect(result).toEqual(expectedState);
  });

  it('should update basket with "setBasket" action', () => {
    const basket = products.map((item) => item.id);
    const expectedState = {
      ...initialState,
      basket,
    };
    const result = productsSlice.reducer(undefined, setBasket(basket));
    expect(result).toEqual(expectedState);
  });

  it('should add item to basket with "addItemToBasket" action', () => {
    const addItemId = 10;
    const expectedState = {
      ...initialState,
      basket: [10],
    };
    const result = productsSlice.reducer(undefined, addItemToBasket(addItemId));
    expect(result).toEqual(expectedState);
  });

  it('should remove item from basket with "removeItemFromBasket" action', () => {
    const removeItemId = 2;
    const basket = [1, 2, 2, 3, 3, 3];
    const expectedBasket = [1, 2, 3, 3, 3];
    const state = {
      ...initialState,
      basket,
    };
    const expectedState = {
      ...initialState,
      basket: expectedBasket,
    };
    const result = productsSlice.reducer(
      state,
      removeItemFromBasket(removeItemId)
    );
    expect(result).toEqual(expectedState);
  });

  it('should call "saveLocalBasket" once with an array of numbers with "updateBasket" action', () => {
    const basket = products.map((item) => item.id);
    const mockSaveLocalBasket = vi.spyOn(basketStorage, 'saveLocalBasket');
    const expectedMockSaveLocalBasketCalledTimes = 1;

    productsSlice.reducer(undefined, updateBasket(basket));

    expect(mockSaveLocalBasket).toBeCalledTimes(
      expectedMockSaveLocalBasketCalledTimes
    );
    expect(mockSaveLocalBasket).toBeCalledWith(basket);
  });

  it('should call "saveLocalBasket" once with an array of numbers with "addItemToBasket" action', () => {
    const productId = 11;
    const mockSaveLocalBasket = vi.spyOn(basketStorage, 'saveLocalBasket');
    const expectedMockSaveLocalBasketCalledTimes = 1;

    productsSlice.reducer(undefined, addItemToBasket(productId));

    expect(mockSaveLocalBasket).toBeCalledTimes(
      expectedMockSaveLocalBasketCalledTimes
    );
    expect(mockSaveLocalBasket).toBeCalledWith([productId]);
  });

  it('should call "saveLocalBasket" once with an array of numbers with "removeItemFromBasket" action', () => {
    const basket = [1, 2, 2, 3, 3, 3];
    const expectedBasket = [1, 2, 3, 3, 3];
    const productId = 2;
    const state = {
      ...initialState,
      basket,
    };
    const mockSaveLocalBasket = vi.spyOn(basketStorage, 'saveLocalBasket');
    const expectedMockSaveLocalBasketCalledTimes = 1;

    productsSlice.reducer(state, removeItemFromBasket(productId));

    expect(mockSaveLocalBasket).toBeCalledTimes(
      expectedMockSaveLocalBasketCalledTimes
    );
    expect(mockSaveLocalBasket).toBeCalledWith(expectedBasket);
  });

  it('should reset postOrderStatus with "resetPostOrderStatus" action', () => {
    const state = {
      ...initialState,
      postOrderStatus: RequestStatus.Success,
    };

    const expectedState = {
      ...initialState,
      postOrderStatus: RequestStatus.Idle,
    };

    const result = productsSlice.reducer(state, resetPostOrderStatus());
    expect(result).toEqual(expectedState);
  });

  it('should reset couponValidateStatus and couponDiscount with "resetCoupon" action', () => {
    const state = {
      ...initialState,
      couponDiscount: 15,
      couponValidateStatus: RequestStatus.Success,
    };

    const expectedState = {
      ...initialState,
      couponDiscount: 0,
      couponValidateStatus: RequestStatus.Idle,
    };

    const result = productsSlice.reducer(state, resetCoupon());
    expect(result).toEqual(expectedState);
  });
});
