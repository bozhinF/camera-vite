import { createApi } from '../../services/api';
import MockAdapter from 'axios-mock-adapter';
import { configureMockStore } from '@jedmao/redux-mock-store';
import { State } from '../../types/state';
import { Action } from 'redux';
import {
  AppThunkDispatch,
  extractActionsTypes,
  getMockOrder,
} from '../../util/mocks';
import { getMockProduct, getMockReview } from '../../util/mocks';
import { Endpoint, NameSpace } from '../../const/const';
import {
  fetchAllProducts,
  fetchProduct,
  fetchProductReviews,
  postOrder,
} from './thunks';
import thunk from 'redux-thunk';

describe('Async actions', () => {
  const axios = createApi();
  const mockAxiosAdapter = new MockAdapter(axios);
  const middleware = [thunk.withExtraArgument(axios)];
  const mockStoreCreator = configureMockStore<
    State,
    Action<string>,
    AppThunkDispatch
  >(middleware);
  let store: ReturnType<typeof mockStoreCreator>;

  beforeEach(() => {
    store = mockStoreCreator({ [NameSpace.Products]: {} });
  });

  describe('fetchAllProducts action', () => {
    it('should dispatch "fetchAllProducts.pending", "fetchAllProducts.fulfilled", when server response 200', async () => {
      const mockProducts = Array.from({ length: 5 }, () => getMockProduct());
      mockAxiosAdapter.onGet(Endpoint.Products).reply(200, mockProducts);

      await store.dispatch(fetchAllProducts());

      const emmitedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emmitedActions);
      const fetchAllProductsFulfilled = emmitedActions.at(1) as ReturnType<
        typeof fetchAllProducts.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        fetchAllProducts.pending.type,
        fetchAllProducts.fulfilled.type,
      ]);

      expect(fetchAllProductsFulfilled.payload).toEqual(mockProducts);
    });

    it('should dispatch "fetchAllProducts.pending", "fetchAllProducts.rejected" when server response 400', async () => {
      mockAxiosAdapter.onGet(Endpoint.Products).reply(400, []);

      await store.dispatch(fetchAllProducts());
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchAllProducts.pending.type,
        fetchAllProducts.rejected.type,
      ]);
    });
  });

  describe('fetchProduct action', () => {
    it('should dispatch "fetchProduct.pending", "fetchProduct.fulfilled", when server response 200', async () => {
      const mockProduct = getMockProduct();
      const id = String(mockProduct.id);
      mockAxiosAdapter
        .onGet(`${Endpoint.Products}/${id}`)
        .reply(200, mockProduct);

      await store.dispatch(fetchProduct({ id }));

      const emmitedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emmitedActions);
      const fetchProductFulfilled = emmitedActions.at(1) as ReturnType<
        typeof fetchProduct.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        fetchProduct.pending.type,
        fetchProduct.fulfilled.type,
      ]);

      expect(fetchProductFulfilled.payload).toEqual(mockProduct);
    });

    it('should dispatch "fetchProduct.pending", "fetchProduct.rejected" when server response 400', async () => {
      const id = '1';
      mockAxiosAdapter.onGet(`${Endpoint.Products}/${id}`).reply(400, {});

      await store.dispatch(fetchProduct({ id }));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchProduct.pending.type,
        fetchProduct.rejected.type,
      ]);
    });
  });

  describe('fetchProductReviews action', () => {
    it('should dispatch "fetchProductReviews.pending", "fetchProductReviews.fulfilled", when server response 200', async () => {
      const review = getMockReview();
      const id = String(review.cameraId);
      mockAxiosAdapter
        .onGet(`${Endpoint.Comments.replace(':cameraId', id)}`)
        .reply(200, review);

      await store.dispatch(fetchProductReviews({ id }));

      const emmitedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emmitedActions);
      const fetchProductReviewsFulfilled = emmitedActions.at(1) as ReturnType<
        typeof fetchProductReviews.fulfilled
      >;

      expect(extractedActionsTypes).toEqual([
        fetchProductReviews.pending.type,
        fetchProductReviews.fulfilled.type,
      ]);

      expect(fetchProductReviewsFulfilled.payload).toEqual(review);
    });

    it('should dispatch "fetchProductReviews.pending", "fetchProductReviews.rejected" when server response 400', async () => {
      const id = '1';
      mockAxiosAdapter
        .onGet(`${Endpoint.Comments.replace(':cameraId', id)}`)
        .reply(400, {});

      await store.dispatch(fetchProductReviews({ id }));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        fetchProductReviews.pending.type,
        fetchProductReviews.rejected.type,
      ]);
    });
  });

  describe('postOrder action', () => {
    it('should dispatch "postOrder.pending", "postOrder.fulfilled", when server response 200', async () => {
      const order = getMockOrder();
      mockAxiosAdapter.onPost(Endpoint.Orders).reply(200);

      await store.dispatch(postOrder({ order }));

      const emmitedActions = store.getActions();
      const extractedActionsTypes = extractActionsTypes(emmitedActions);

      expect(extractedActionsTypes).toEqual([
        postOrder.pending.type,
        postOrder.fulfilled.type,
      ]);
    });

    it('should dispatch "postOrder.pending", "postOrder.rejected" when server response 400', async () => {
      const order = getMockOrder();
      mockAxiosAdapter.onPost(Endpoint.Orders).reply(400);

      await store.dispatch(postOrder({ order }));
      const actions = extractActionsTypes(store.getActions());

      expect(actions).toEqual([
        postOrder.pending.type,
        postOrder.rejected.type,
      ]);
    });
  });
});
