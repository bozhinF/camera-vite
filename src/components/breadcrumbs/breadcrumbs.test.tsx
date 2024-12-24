import { render, screen } from '@testing-library/react';
import { AppRoute, Crumb } from '../../const/const';
import Breadcrumbs from './breadcrumbs';
import { createMemoryHistory, MemoryHistory } from 'history';
import { withHistory } from '../../util/mock-component';
import { getMockProduct } from '../../util/mocks';

describe('Component: Breadcrumbs', () => {
  let mockHistory: MemoryHistory;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
  });

  it('should renders main breadcrumb for root route', () => {
    const withHistoryComponent = withHistory(<Breadcrumbs />, mockHistory);
    mockHistory.push(AppRoute.Main);

    render(withHistoryComponent);

    const mainLinkElement = screen.getByText(Crumb.Main);
    expect(mainLinkElement).toBeInTheDocument();
  });

  it('should renders breadcrumbs for a deeper route and with custom tip', () => {
    const product = getMockProduct();
    const productId = product.id;
    const expectTip = product.name;
    const withHistoryComponent = withHistory(
      <Breadcrumbs tip={expectTip} />,
      mockHistory
    );
    mockHistory.push(`${AppRoute.Product}/${productId}`);

    render(withHistoryComponent);
    const mainLinkElement = screen.getByText(Crumb.Main);
    const catalogLinkElement = screen.getByText(Crumb.Catalog);
    const tipElement = screen.getByText(expectTip);

    expect(mainLinkElement).toBeInTheDocument();
    expect(catalogLinkElement).toBeInTheDocument();
    expect(tipElement).toBeInTheDocument();
    expect(mainLinkElement).toHaveAttribute('href', AppRoute.Main);
    expect(catalogLinkElement).toHaveAttribute('href', AppRoute.Catalog);
    expect(tipElement).not.toHaveAttribute('href');
  });

  it('should does not render extraneous crumbs if they are not in Crumb', () => {
    const withHistoryComponent = withHistory(<Breadcrumbs />, mockHistory);
    mockHistory.push('/unknown/route');

    render(withHistoryComponent);

    expect(screen.getByText(Crumb.Main)).toBeInTheDocument();
    expect(screen.queryByText(/Unknown/i)).not.toBeInTheDocument();
  });
});
