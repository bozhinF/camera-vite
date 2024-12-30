import { render, screen } from '@testing-library/react';
import { AppRoute, ElementAttribute, ElementRole } from '../../const/const';
import EmptyBasket from './empty-basket';
import { withHistory } from '../../util/mock-component';
import { createMemoryHistory } from 'history';

describe('EmptyBasket Component', () => {
  test('renders EmptyBasket with correct text', () => {
    const epectedEmptyBasketTitleText = 'Корзина пуста';
    const expectedEmptyBasketText =
      'Воспользуйтесь поиском, чтобы найти всё, что нужно';
    const emptyBasketLinkToMainPageText = 'В каталог';
    const memoryHistory = createMemoryHistory();
    const withHistoryComponent = withHistory(<EmptyBasket />, memoryHistory);
    memoryHistory.push(AppRoute.Basket);

    render(withHistoryComponent);

    const mainTitle = screen.getByRole(ElementRole.Heading, {
      name: epectedEmptyBasketTitleText,
    });
    const secondaryTitle = screen.getByRole(ElementRole.Heading, {
      name: expectedEmptyBasketText,
    });
    const linkElement = screen.getByRole(ElementRole.Link, {
      name: emptyBasketLinkToMainPageText,
    });
    expect(mainTitle).toBeInTheDocument();
    expect(secondaryTitle).toBeInTheDocument();
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute(ElementAttribute.Href, AppRoute.Main);
  });
});
