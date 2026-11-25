import type { SortKey, Store } from '../types';
import { Button } from './Button';

interface ControlsProps {
  search: string;
  storeID: string;
  sort: SortKey;
  stores: Store[];
  onSearchChange: (value: string) => void;
  onStoreChange: (value: string) => void;
  onSortChange: (value: SortKey) => void;
  onRefresh: () => void;
}

export function Controls({
  search,
  storeID,
  sort,
  stores,
  onSearchChange,
  onStoreChange,
  onSortChange,
  onRefresh,
}: ControlsProps) {
  return (
    <section className="controls" aria-label="Фильтры">
      <label className="field field_wide">
        <span className="field__label">Название игры</span>
        <input
          type="search"
          placeholder="Например, resident evil"
          autoComplete="off"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <label className="field">
        <span className="field__label">Магазин</span>
        <select value={storeID} onChange={(e) => onStoreChange(e.target.value)}>
          <option value="">Все магазины</option>
          {stores
            .filter((store) => Number(store.isActive) === 1)
            .map((store) => (
              <option key={store.storeID} value={store.storeID}>
                {store.storeName}
              </option>
            ))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Сортировка</span>
        <select value={sort} onChange={(e) => onSortChange(e.target.value as SortKey)}>
          <option value="none">Без сортировки</option>
          <option value="priceDesc">Цена: по убыванию</option>
          <option value="priceAsc">Цена: по возрастанию</option>
          <option value="reviews">По отзывам</option>
        </select>
      </label>

      <Button onClick={onRefresh}>Обновить</Button>
    </section>
  );
}
