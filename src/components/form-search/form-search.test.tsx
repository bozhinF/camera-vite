import { render, screen, fireEvent } from '@testing-library/react';
import FormSearch from './form-search';
import { withHistory, withStore } from '../../util/mock-component';
import { createMemoryHistory, MemoryHistory } from 'history';
import { getMockProduct, getMockStore } from '../../util/mocks';
import { AppRoute, NameSpace } from '../../const/const';
import { State } from '../../types/state';

describe('Component: FormSearch', () => {
  const mockProducts = Array.from({ length: 5 }, () => getMockProduct());
  const mockProductsIds = [1, 2, 3, 4, 5];
  const mockProductsNames = [
    'камера',
    'объектив',
    'штатив',
    'photocamera1',
    'photocamera2',
  ];
  mockProducts.forEach((product, index) => {
    product.id = mockProductsIds[index];
    product.name = mockProductsNames[index];
  });

  let mockHistory: MemoryHistory;
  let mockStore: State;
  const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));

  beforeEach(() => {
    vi.clearAllMocks();
    mockHistory = createMemoryHistory();
    mockStore = getMockStore();
    mockStore[NameSpace.Products].allProducts = mockProducts;
  });

  it('should renders input and close button', () => {
    const withHistoryComponent = withHistory(<FormSearch />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    expect(screen.getByPlaceholderText(/поиск по сайту/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /сбросить поиск/i })
    ).toBeInTheDocument();
  });

  it('should shows filtered products after input', () => {
    const withHistoryComponent = withHistory(<FormSearch />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    const input = screen.getByPlaceholderText(/поиск по сайту/i);
    fireEvent.change(input, { target: { value: 'pho' } });
    fireEvent.focus(input);

    expect(screen.queryByText(/камера/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/объектив/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/штатив/i)).not.toBeInTheDocument();
    expect(screen.getByText(/photocamera1/i)).toBeInTheDocument();
    expect(screen.getByText(/photocamera2/i)).toBeInTheDocument();
  });

  it('should navigates to product page on item click', () => {
    vi.mock('react-router-dom', async () => {
      const router: object = await vi.importActual('react-router-dom');
      return { ...router, useNavigate: () => mockNavigate };
    });

    const withHistoryComponent = withHistory(<FormSearch />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    const input = screen.getByPlaceholderText(/поиск по сайту/i);
    fireEvent.change(input, { target: { value: 'кам' } });
    fireEvent.focus(input);

    const linkToProduct = screen.getByText(/камера/i);
    fireEvent.click(linkToProduct);

    expect(mockNavigate).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(
      `${AppRoute.Product.replace(':id', '1')}`
    );
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('should resets input on close button click', () => {
    const withHistoryComponent = withHistory(<FormSearch />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    const input: HTMLInputElement =
      screen.getByPlaceholderText(/поиск по сайту/i);

    fireEvent.change(input, { target: { value: 'кам' } });
    expect(input.value).toBe('кам');

    fireEvent.click(screen.getByRole('button', { name: /сбросить поиск/i }));
    expect(input.value).toBe('');
  });

  it('should handles arrow key navigation', () => {
    const withHistoryComponent = withHistory(<FormSearch />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    const input = screen.getByPlaceholderText(/поиск по сайту/i);

    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'кам' } });

    expect(screen.getByText(/камера/i)).toBeInTheDocument();

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByText(/камера/i)).toHaveFocus();

    fireEvent.keyDown(screen.getByText(/камера/i), { key: 'ArrowUp' });
    expect(input).toHaveFocus();
  });
});
