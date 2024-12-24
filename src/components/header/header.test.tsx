import { render, screen } from '@testing-library/react';
import Header from './header';
import { withHistory, withStore } from '../../util/mock-component';
import { createMemoryHistory, MemoryHistory } from 'history';
import { AppRoute } from '../../const/const';
import { getMockStore } from '../../util/mocks';

describe('Component: Header', () => {
  let mockHistory: MemoryHistory;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders logo link', () => {
    const withHistoryComponent = withHistory(<Header />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const logoLink = screen.getByLabelText(/переход на главную/i);
    expect(logoLink).toBeInTheDocument();
    expect(logoLink).toHaveAttribute('href', AppRoute.Main);
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
      expect(navLink).toHaveAttribute('href', href);
    });
  });

  it('should renders FormSearch component', () => {
    const withHistoryComponent = withHistory(<Header />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const formSearchInput = screen.getByPlaceholderText(/поиск по сайту/i);
    expect(formSearchInput).toBeInTheDocument();
  });

  it('should renders HeaderBasketLink component', () => {
    const withHistoryComponent = withHistory(<Header />, mockHistory);
    const { withStoreComponent } = withStore(
      withHistoryComponent,
      getMockStore()
    );
    mockHistory.push(AppRoute.Main);

    render(withStoreComponent);

    const headerBasketLink = screen.getByTestId('basket-link');
    expect(headerBasketLink).toBeInTheDocument();
  });
});
