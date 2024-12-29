import { render, screen } from '@testing-library/react';
import Header from './header';
import { withHistory, withStore } from '../../util/mock-component';
import { createMemoryHistory, MemoryHistory } from 'history';
import { AppRoute, ElementAttribute } from '../../const/const';
import { getMockStore } from '../../util/mocks';

describe('Component: Header', () => {
  let mockHistory: MemoryHistory;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders logo link', () => {
    const expectedLogoLinkLabelText = /переход на главную/i;
    const withHistoryComponent = withHistory(<Header />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const logoLink = screen.getByLabelText(expectedLogoLinkLabelText);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute(ElementAttribute.Href, AppRoute.Main);
  });

  it('should renders navigation links', () => {
    const links = [
      { text: /Каталог/i, href: AppRoute.Catalog },
      { text: /Гарантии/i, href: '/' },
      { text: /Доставка/i, href: '/' },
      { text: /О компании/i, href: '/' },
    ];
    const withHistoryComponent = withHistory(<Header />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    links.forEach(({ text, href }) => {
      const navLink: HTMLAnchorElement = screen.getByText(text);
      expect(navLink).toBeInTheDocument();
      expect(navLink).toHaveAttribute(ElementAttribute.Href, href);
    });
  });

  it('should renders FormSearch component', () => {
    const expectedSearchInputPlaceholderText = /поиск по сайту/i;
    const withHistoryComponent = withHistory(<Header />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const formSearchInput = screen.getByPlaceholderText(
      expectedSearchInputPlaceholderText
    );
    expect(formSearchInput).toBeInTheDocument();
  });

  it('should renders HeaderBasketLink component', () => {
    const expectedHeaderBasketLinkTestId = 'basket-link';
    const withHistoryComponent = withHistory(<Header />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const headerBasketLink = screen.getByTestId(expectedHeaderBasketLinkTestId);
    expect(headerBasketLink).toBeInTheDocument();
  });
});
