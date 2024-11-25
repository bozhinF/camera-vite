import { useState } from 'react';
import { Product, SetFilterStateOptions } from '../../types/types';
import { FilterState } from '../../store/filter-slice/filter-slice';

type TabsProps = {
  product: Product;
  filterState: FilterState;
  onChange: <T extends FilterState, K extends keyof T, V extends T[K]>(
    state: T,
    options: SetFilterStateOptions<K, V>
  ) => void;
};

const TabItem = {
  Characteristics: { title: 'Характеристики', value: 'characteristics' },
  Description: { title: 'Описание', value: 'description' },
} as const;

function Tabs({ product, filterState, onChange }: TabsProps): JSX.Element {
  const { vendorCode, category, type, level, description } = product;

  const activeTab =
    Object.values(TabItem).find((item) => item.value === filterState.tab) ||
    TabItem.Characteristics;
  const [active, setActive] =
    useState<(typeof TabItem)[keyof typeof TabItem]>(activeTab);

  const handleTabClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const button = event.target as HTMLButtonElement;
    const tabType = Object.values(TabItem).find(
      ({ value }) => value === button.dataset.tabType
    );
    if (tabType === undefined) {
      return;
    }
    setActive(tabType);
    onChange({ ...filterState }, [{ key: 'tab', value: tabType.value }]);
  };

  return (
    <div className="tabs product__tabs">
      <div className="tabs__controls product__tabs-controls">
        {Object.values(TabItem).map(({ title, value }) => (
          <button
            className={`tabs__control ${
              active.value === value ? 'is-active' : ''
            }`}
            key={value}
            data-tab-type={value}
            type="button"
            onClick={handleTabClick}
          >
            {title}
          </button>
        ))}
      </div>
      {}
      <div className="tabs__content">
        <div
          className={`tabs__element ${
            active === TabItem.Characteristics ? 'is-active' : ''
          }`}
        >
          <ul className="product__tabs-list">
            <li className="item-list">
              <span className="item-list__title">Артикул:</span>
              <p className="item-list__text"> {vendorCode}</p>
            </li>
            <li className="item-list">
              <span className="item-list__title">Категория:</span>
              <p className="item-list__text">{category}</p>
            </li>
            <li className="item-list">
              <span className="item-list__title">Тип камеры:</span>
              <p className="item-list__text">{type}</p>
            </li>
            <li className="item-list">
              <span className="item-list__title">Уровень:</span>
              <p className="item-list__text">{level}</p>
            </li>
          </ul>
        </div>
        <div
          className={`tabs__element ${
            active === TabItem.Description ? 'is-active' : ''
          }`}
        >
          <div className="product__tabs-text">
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tabs;
