import { useMemo, useState } from 'react';
import { Controls } from './components/Controls';
import { DealList } from './components/DealList';
import { Empty, ErrorState, Loading } from './components/States';
import { useDeals } from './hooks/useDeals';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { useStores } from './hooks/useStores';
import type { SortKey } from './types';

export default function App() {
  const [search, setSearch] = useState('');
  const [storeID, setStoreID] = useState('');
  const [sort, setSort] = useState<SortKey>('none');
  const [reloadKey, setReloadKey] = useState(0);

  const query = useDebouncedValue(search, 400);

  const stores = useStores();
  const storeNames = useMemo(
    () => new Map(stores.map((store) => [store.storeID, store.storeName])),
    [stores],
  );

  const { status, deals, error, hasMore, moreLoading, moreError, loadMore } = useDeals(
    { query, storeID, sort },
    reloadKey,
  );

  const reload = () => setReloadKey((key) => key + 1);

  return (
    <>
      <header className="header">
        <h1 className="header__title">Скидки на игры</h1>
        <p className="header__hint">
          Цены в магазинах Steam, GOG, Epic и других. Данные: CheapShark API
        </p>
      </header>

      <main className="main">
        <Controls
          search={search}
          storeID={storeID}
          sort={sort}
          stores={stores}
          onSearchChange={setSearch}
          onStoreChange={setStoreID}
          onSortChange={setSort}
          onRefresh={reload}
        />

        <p className="status" aria-live="polite">
          {status === 'success' ? `Показано предложений: ${deals.length}` : ''}
        </p>

        {status === 'loading' && <Loading />}
        {status === 'empty' && <Empty />}
        {status === 'error' && <ErrorState message={error} onRetry={reload} />}
        {status === 'success' && (
          <DealList
            deals={deals}
            storeNames={storeNames}
            hasMore={hasMore}
            moreLoading={moreLoading}
            moreError={moreError}
            onLoadMore={loadMore}
          />
        )}
      </main>
    </>
  );
}
