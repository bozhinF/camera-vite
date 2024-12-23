import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/app/app';
import { Provider } from 'react-redux';
import { store } from './store';
import { fetchAllProducts } from './store/products-slice/thunks';
import { getLocalBasket } from './services/basket';
import { setBasket } from './store/products-slice/products-slice';
import HistoryRouter from './components/history-route/history-route';
import browserHistory from './browser-history';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

store.dispatch(fetchAllProducts());
const basket = getLocalBasket();
if (basket.length) {
  store.dispatch(setBasket(basket));
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HistoryRouter history={browserHistory}>
        <App />
      </HistoryRouter>
    </Provider>
  </React.StrictMode>
);
