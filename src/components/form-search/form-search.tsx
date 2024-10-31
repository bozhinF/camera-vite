import React, { useRef, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { getAllProducts } from '../../store/products-slice/selectors';
import { AppRoute } from '../../const/const';
import { Products } from '../../types/types';
import { useNavigate } from 'react-router-dom';

const NUMBER_OF_CHARACTERS_TO_SERCH = 3;
const filterProducts = (products: Products, searchString: string) =>
  products.filter(({ name }) =>
    name.toLowerCase().includes(searchString.toLowerCase())
  );

function FormSearch(): JSX.Element {
  const allProducts = useAppSelector(getAllProducts);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchInput, setSearchInput] = useState('');
  const [isInputActive, setInputActive] = useState(false);

  const filteredProducts =
    searchInput.length >= NUMBER_OF_CHARACTERS_TO_SERCH
      ? filterProducts(allProducts, searchInput)
      : [];

  const isShowSelectList = Boolean(
    searchInput.length >= NUMBER_OF_CHARACTERS_TO_SERCH &&
      filteredProducts.length &&
      isInputActive
  );

  const handleFormSearchFocus = () => setInputActive(true);

  const handleFormSearchBlur = (event: React.FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      if (isInputActive) {
        setInputActive(false);
      }
    }
  };

  const handleSerchInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchInput(event.target.value);

  const handleSelectItemClick = (route: string) => {
    setSearchInput('');
    navigate(route);
  };

  const handleSelectItemEnterKeyDown = (
    event: React.KeyboardEvent,
    route: string
  ) => {
    if (event.key === 'Enter') {
      setSearchInput('');
      navigate(route);
    }
  };

  const handleResetButtonClick = () => {
    setSearchInput('');
    inputRef.current?.focus();
  };

  return (
    <div
      className={`form-search ${searchInput ? 'list-opened' : ''}`}
      onFocus={handleFormSearchFocus}
      onBlur={handleFormSearchBlur}
    >
      <form>
        <label>
          <svg
            className="form-search__icon"
            width="16"
            height="16"
            aria-hidden="true"
          >
            <use xlinkHref="#icon-lens"></use>
          </svg>
          <input
            className="form-search__input"
            type="text"
            autoComplete="off"
            placeholder="Поиск по сайту"
            onChange={handleSerchInputChange}
            value={searchInput}
            ref={inputRef}
          />
        </label>
        {isShowSelectList && (
          <ul
            className="form-search__select-list scroller"
            style={{
              paddingRight: '4px',
              overflow: 'auto',
            }}
          >
            {filteredProducts.map(({ name, id }) => {
              const route = `${AppRoute.Product.replace(':id', String(id))}`;

              return (
                <li
                  key={id}
                  className="form-search__select-item"
                  tabIndex={0}
                  onClick={() => handleSelectItemClick(route)}
                  onKeyDown={(event) =>
                    handleSelectItemEnterKeyDown(event, route)}
                >
                  {name}
                </li>
              );
            })}
          </ul>
        )}
      </form>
      <button
        className="form-search__reset"
        type="reset"
        onClick={handleResetButtonClick}
      >
        <svg width="10" height="10" aria-hidden="true">
          <use xlinkHref="#icon-close"></use>
        </svg>
        <span className="visually-hidden">Сбросить поиск</span>
      </button>
    </div>
  );
}

export default FormSearch;
