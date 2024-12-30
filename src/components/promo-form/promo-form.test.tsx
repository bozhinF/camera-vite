import { render, screen, fireEvent } from '@testing-library/react';
import { ElementRole, Endpoint } from '../../const/const';
import { postCoupon } from '../../store/products-slice/thunks';
import PromoForm from './promo-form';
import { extractActionsTypes, getMockStore } from '../../util/mocks';
import { withStore } from '../../util/mock-component';
import userEvent from '@testing-library/user-event';

describe('Component: PromoForm', () => {
  const onFormSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should renders PromoForm with input and button', () => {
    const expectedPromoTitleText = /промокод/i;
    const expextedButtonText = /применить/i;
    const { withStoreComponent } = withStore(
      <PromoForm onFormSubmit={onFormSubmit} />,
      getMockStore()
    );

    render(withStoreComponent);

    expect(screen.getByLabelText(expectedPromoTitleText)).toBeInTheDocument();
    expect(
      screen.getByRole(ElementRole.Button, { name: expextedButtonText })
    ).toBeInTheDocument();
  });

  it('should validates input and shows error message', () => {
    const expectedPlaceholder = /введите промокод/i;
    const changeInputValue = 'a a';
    const expectedWarningText = /промокод неверный/i;
    const { withStoreComponent } = withStore(
      <PromoForm onFormSubmit={onFormSubmit} />,
      getMockStore()
    );

    render(withStoreComponent);

    const input = screen.getByPlaceholderText(expectedPlaceholder);
    fireEvent.paste(input, { target: { value: changeInputValue } });

    expect(screen.getByText(expectedWarningText)).toBeInTheDocument();
  });

  it('should dispatches postCoupon on form submit', async () => {
    const expectedPlaceholder = /введите промокод/i;
    const expextedButtonText = /применить/i;
    const inputValue = 'VALIDCODE';
    const { withStoreComponent, mockStore, mockAxiosAdapter } = withStore(
      <PromoForm onFormSubmit={onFormSubmit} />,
      getMockStore()
    );
    const dispatchSpy = vi.spyOn(mockStore, 'dispatch');
    mockAxiosAdapter.onPost(Endpoint.Coupons).reply(200, []);

    render(withStoreComponent);

    const input = screen.getByPlaceholderText(expectedPlaceholder);
    await userEvent.type(input, inputValue);
    await userEvent.click(
      screen.getByRole(ElementRole.Button, { name: expextedButtonText })
    );
    const actions = extractActionsTypes(mockStore.getActions());
    expect(actions).toEqual([
      postCoupon.pending.type,
      postCoupon.fulfilled.type,
    ]);
    expect(dispatchSpy).toHaveBeenCalled();
  });
});
