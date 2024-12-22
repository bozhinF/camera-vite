import { Navigate, Route, Routes } from 'react-router-dom';
import { AppRoute } from '../../const/const';
import Layout from '../layout/layout';
import CatalogPage from '../../pages/catalog-page/catalog-page';
import BasketPage from '../../pages/basket-page/basket-page';
import ProductPage from '../../pages/product-page/product-page';
import NotFoundPage from '../../pages/not-found-page/not-found-page';
import { HelmetProvider } from 'react-helmet-async';

function App(): JSX.Element {
  return (
    <HelmetProvider>
      <Routes>
        <Route path={AppRoute.Main} element={<Layout />}>
          <Route index element={<Navigate to={AppRoute.Catalog} />} />
          <Route path={AppRoute.Catalog} element={<CatalogPage />} />
          <Route path={AppRoute.Basket} element={<BasketPage />} />
          <Route path={AppRoute.Product} element={<ProductPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
