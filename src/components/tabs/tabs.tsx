import { useState } from 'react';
import { Product } from '../../types/types';

type TabsProps = {
  product: Product;
};

enum TabItem {
  Characteristics = 'Характеристики',
  Description = 'Описание',
}

function Tabs({ product }: TabsProps): JSX.Element {
  const { vendorCode, category, type, level, description } = product;

  const [active, setActive] = useState<TabItem>(
    Object.keys(TabItem)[0] as TabItem
  );

  const handleTabClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const button = event.target as HTMLButtonElement;
    const tabType = button.dataset.tabType;
    if (tabType === undefined) {
      return;
    }
    setActive(tabType as TabItem);
  };

  return (
    <div className="tabs product__tabs">
      <div className="tabs__controls product__tabs-controls">
        {Object.entries(TabItem).map(([key, value]) => (
          <button
            className={`tabs__control ${active === key ? 'is-active' : ''}`}
            key={key}
            data-tab-type={key}
            type="button"
            onClick={handleTabClick}
          >
            {value}
          </button>
        ))}
      </div>
      {}
      <div className="tabs__content">
        <div
          className={`tabs__element ${
            active === (Object.keys(TabItem)[0] as TabItem) ? 'is-active' : ''
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
            active === (Object.keys(TabItem)[1] as TabItem) ? 'is-active' : ''
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
