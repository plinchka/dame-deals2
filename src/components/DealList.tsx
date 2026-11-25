import type { Deal } from '../types';
import { Button } from './Button';
import { DealCard } from './DealCard';

interface DealListProps {
  deals: Deal[];
  storeNames: Map<string, string>;
  hasMore: boolean;
  moreLoading: boolean;
  moreError: string | null;
  onLoadMore: () => void;
}

export function DealList({
  deals,
  storeNames,
  hasMore,
  moreLoading,
  moreError,
  onLoadMore,
}: DealListProps) {
  return (
    <div>
      <ul className="deal-list">
        {deals.map((deal) => (
          <DealCard key={deal.dealID} deal={deal} storeName={storeNames.get(deal.storeID)} />
        ))}
      </ul>

      <div className="more">
        {moreError && <p className="more__error">{moreError}</p>}
        {hasMore && (
          <Button onClick={onLoadMore} disabled={moreLoading}>
            {moreLoading ? 'Загрузка…' : moreError ? 'Повторить' : 'Показать ещё'}
          </Button>
        )}
      </div>
    </div>
  );
}
