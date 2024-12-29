import { render, screen, fireEvent } from '@testing-library/react';
import FormSearch from './form-search';
import { withHistory, withStore } from '../../util/mock-component';
import { createMemoryHistory, MemoryHistory } from 'history';
import { getMockProduct, getMockStore } from '../../util/mocks';
import { AppRoute, ElementRole, EventKey, NameSpace } from '../../const/const';
import { State } from '../../types/state';

describe('Component: FormSearch', () => {
  const mockProductsNames = [
    'камера',
    'объектив',
    'штатив',
    'photocamera1',
    'photocamera2',
  ];
  const mockProducts = mockProductsNames.map((productName, index) =>
    getMockProduct({ id: index + 1, name: productName })
  );

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
    const expectedPlaceholder = /поиск по сайту/i;
    const expectedButtonText = /сбросить поиск/i;
    const withHistoryComponent = withHistory(<FormSearch />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    expect(
      screen.getByPlaceholderText(expectedPlaceholder)
    ).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: expectedButtonText })
    ).toBeInTheDocument();
  });

  it('should shows filtered products after input', () => {
    const expectedPlaceholder = /поиск по сайту/i;
    const inputedText = 'pho';
    const notExpectedSearchResults = [/камера/i, /объектив/i, /штатив/i];
    const expectedSearchResults = [/photocamera1/i, /photocamera2/i];
    const withHistoryComponent = withHistory(<FormSearch />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    const input = screen.getByPlaceholderText(expectedPlaceholder);
    fireEvent.change(input, { target: { value: inputedText } });
    fireEvent.focus(input);
    notExpectedSearchResults.forEach((searchResult) =>
      expect(screen.queryByText(searchResult)).not.toBeInTheDocument()
    );
    expectedSearchResults.forEach((searchResult) =>
      expect(screen.queryByText(searchResult)).toBeInTheDocument()
    );
  });

  it('should navigates to product page on item click', () => {
    const expectedPlaceholder = /поиск по сайту/i;
    const inputedText = 'кам';
    const expectedLinkToProductText = /камера/i;
    const expectedMockNavigateCalledWith = `${AppRoute.Product.replace(
      ':id',
      '1'
    )}`;
    const expectedMockNavigateCalledTimes = 1;
    const withHistoryComponent = withHistory(<FormSearch />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    vi.mock('react-router-dom', async () => {
      const router: object = await vi.importActual('react-router-dom');
      return { ...router, useNavigate: () => mockNavigate };
    });
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    const input = screen.getByPlaceholderText(expectedPlaceholder);
    fireEvent.change(input, { target: { value: inputedText } });
    fireEvent.focus(input);

    const linkToProduct = screen.getByText(expectedLinkToProductText);
    fireEvent.click(linkToProduct);
    expect(mockNavigate).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(expectedMockNavigateCalledWith);
    expect(mockNavigate).toHaveBeenCalledTimes(expectedMockNavigateCalledTimes);
  });

  it('should resets input on close button click', () => {
    const expectedInputPlaceholder = /поиск по сайту/i;
    const inputedText = 'кам';
    const expectedResetButtonText = /сбросить поиск/i;
    const expectedInputValueAfterReset = '';
    const withHistoryComponent = withHistory(<FormSearch />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    const input: HTMLInputElement = screen.getByPlaceholderText(
      expectedInputPlaceholder
    );
    fireEvent.change(input, { target: { value: inputedText } });
    expect(input.value).toBe(inputedText);
    fireEvent.click(
      screen.getByRole(ElementRole.Button, { name: expectedResetButtonText })
    );
    expect(input.value).toBe(expectedInputValueAfterReset);
  });

  it('should handles arrow key navigation', () => {
    const expectedInputPlaceholder = /поиск по сайту/i;
    const inputedText = 'кам';
    const expectedLinkToProductText = /камера/i;
    const withHistoryComponent = withHistory(<FormSearch />, mockHistory);
    const { withStoreComponent } = withStore(withHistoryComponent, mockStore);
    mockHistory.push(AppRoute.Catalog);

    render(withStoreComponent);

    const input = screen.getByPlaceholderText(expectedInputPlaceholder);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: inputedText } });
    expect(screen.getByText(expectedLinkToProductText)).toBeInTheDocument();
    fireEvent.keyDown(input, { key: EventKey.ArrowDown });
    expect(screen.getByText(expectedLinkToProductText)).toHaveFocus();
    fireEvent.keyDown(screen.getByText(expectedLinkToProductText), {
      key: EventKey.ArrowUp,
    });
    expect(input).toHaveFocus();
  });
});
