import React, { useRef, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { getAllProducts } from '../../store/products-slice/selectors';
import { AppRoute, EventKey } from '../../const/const';
import { Products } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import CloseButton from '../close-button/close-button';

enum CloseButtonOption {
  Text = 'Сбросить поиск',
  ClassName = 'form-search__reset',
  Type = 'reset',
}

const SEARCH_RESULT_ITEM_CLASSNAME = 'form-search__select-item';
const NUMBER_OF_CHARACTERS_TO_SERCH = 3;

const filterProducts = (products: Products, searchString: string) =>
  products.filter(({ name }) =>
    name.toLowerCase().includes(searchString.toLowerCase())
  );

function FormSearch(): JSX.Element {
  const allProducts = useAppSelector(getAllProducts);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const ulRef = useRef<HTMLUListElement>(null);
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
    if (event.key === EventKey.Enter) {
      setSearchInput('');
      navigate(route);
    }
  };

  const handleResetButtonClick = () => {
    setSearchInput('');
    inputRef.current?.focus();
  };

  const handleArrowKeyDown: React.KeyboardEventHandler<HTMLFormElement> = (
    event
  ) => {
    const target = event.target as HTMLElement;
    if (event.key === EventKey.ArrowUp) {
      event.preventDefault();
      if (
        target.classList.contains(SEARCH_RESULT_ITEM_CLASSNAME) &&
        target.previousElementSibling
      ) {
        const previous = target.previousElementSibling as HTMLElement;
        previous.focus();
      }
      if (
        target.classList.contains(SEARCH_RESULT_ITEM_CLASSNAME) &&
        !target.previousElementSibling
      ) {
        const inputElement = inputRef.current;
        if (inputElement) {
          inputElement.focus();
        }
      }
    }
    if (event.key === EventKey.ArrowDown) {
      event.preventDefault();
      if (target === inputRef.current) {
        const firstListItem = ulRef.current?.firstChild;
        if (firstListItem) {
          const firstListItemElement = firstListItem as HTMLLIElement;
          firstListItemElement.focus();
        }
      }
      if (
        target.classList.contains(SEARCH_RESULT_ITEM_CLASSNAME) &&
        target.nextElementSibling
      ) {
        const next = target.nextElementSibling as HTMLElement;
        next.focus();
      }
    }
  };

  return (
    <div
      className={`form-search ${searchInput ? 'list-opened' : ''}`}
      onFocus={handleFormSearchFocus}
      onBlur={handleFormSearchBlur}
    >
      <form onKeyDown={handleArrowKeyDown}>
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
            ref={ulRef}
          >
            {filteredProducts.map(({ name, id }) => {
              const route = `${AppRoute.Product.replace(':id', String(id))}`;

              return (
                <li
                  key={id}
                  className={SEARCH_RESULT_ITEM_CLASSNAME}
                  tabIndex={0}
                  onClick={() => handleSelectItemClick(route)}
                  onKeyDown={(event) => handleSelectItemEnterKeyDown(event, route)}
                >
                  {name}
                </li>
              );
            })}
          </ul>
        )}
      </form>
      <CloseButton
        text={CloseButtonOption.Text}
        className={CloseButtonOption.ClassName}
        type={CloseButtonOption.Type}
        onClick={handleResetButtonClick}
      />
    </div>
  );
}

export default FormSearch;
