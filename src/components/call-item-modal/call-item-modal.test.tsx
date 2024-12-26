import { render, screen, fireEvent } from '@testing-library/react';
import {
  extractActionsTypes,
  getMockProduct,
  getMockStore,
} from '../../util/mocks';
import CallItemModal from './call-item-modal';
import { withStore } from '../../util/mock-component';
import userEvent from '@testing-library/user-event';
import { postOrder } from '../../store/products-slice/thunks';
import { Endpoint } from '../../const/const';

describe('Component: CallItemModal', () => {
  const mockOnCloseButtonClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders the modal correctly with a product', () => {
    const mockProduct = getMockProduct();

    const { withStoreComponent } = withStore(
      <CallItemModal
        callItem={mockProduct}
        onCloseButtonClick={mockOnCloseButtonClick}
      />,
      getMockStore()
    );

    render(withStoreComponent);

    expect(screen.getByText(/Свяжитесь со мной/i)).toBeInTheDocument();

    expect(screen.getByRole('img')).toBeInTheDocument();

    const orderButton = screen.getByRole('button', { name: /Заказать/i });
    expect(orderButton).toBeInTheDocument();
    expect(orderButton).not.toBeDisabled();
  });

  it('should dispatches order when phone is valid', async () => {
    const mockProduct = getMockProduct();
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      <CallItemModal
        callItem={mockProduct}
        onCloseButtonClick={mockOnCloseButtonClick}
      />,
      getMockStore()
    );
    mockAxiosAdapter.onPost(Endpoint.Orders).reply(200, []);
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');

    render(withStoreComponent);

    const phoneInput = screen.getByRole('textbox');
    await userEvent.type(phoneInput, '9991234567');

    const orderButton = screen.getByRole('button', { name: /Заказать/i });
    await userEvent.click(orderButton);

    expect(dispatchSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const actions = extractActionsTypes(mockStore.getActions());
    expect(actions).toEqual([postOrder.pending.type, postOrder.fulfilled.type]);
  });

  it('should closes the modal when close button is clicked', () => {
    const mockProduct = getMockProduct();
    const { withStoreComponent } = withStore(
      <CallItemModal
        callItem={mockProduct}
        onCloseButtonClick={mockOnCloseButtonClick}
      />,
      getMockStore()
    );

    render(withStoreComponent);

    const closeButton = screen.getByRole('button', { name: /Закрыть попап/i });
    fireEvent.click(closeButton);
    expect(mockOnCloseButtonClick).toHaveBeenCalled();
  });
});
