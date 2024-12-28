import { render, screen } from '@testing-library/react';
import { AppRoute, Crumb, ElementAttribute } from '../../const/const';
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
    expect(mainLinkElement).toHaveAttribute(
      ElementAttribute.Href,
      AppRoute.Main
    );
    expect(catalogLinkElement).toHaveAttribute(
      ElementAttribute.Href,
      AppRoute.Catalog
    );
    expect(tipElement).not.toHaveAttribute(ElementAttribute.Href);
  });

  it('should does not render extraneous crumbs if they are not in Crumb', () => {
    const withHistoryComponent = withHistory(<Breadcrumbs />, mockHistory);
    const unknownRoute = '/unknown/route';
    const crumbTextForUnknownRoute = /Unknown/i;
    mockHistory.push(unknownRoute);

    render(withHistoryComponent);

    expect(screen.getByText(Crumb.Main)).toBeInTheDocument();
    expect(
      screen.queryByText(crumbTextForUnknownRoute)
    ).not.toBeInTheDocument();
  });
});
