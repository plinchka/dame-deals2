import { useCallback, useEffect, useRef, useState } from 'react';
import { describeError, fetchDeals, PAGE_SIZE } from '../api';
import type { Deal, DealsStatus, Filters } from '../types';

function mergeDeals(prev: Deal[], next: Deal[]): Deal[] {
  const seen = new Set(prev.map((deal) => deal.dealID));
  const fresh = next.filter((deal) => {
    if (seen.has(deal.dealID)) return false;
    seen.add(deal.dealID);
    return true;
  });
  return [...prev, ...fresh];
}

export function useDeals({ query, storeID, sort }: Filters, reloadKey: number) {
  const [status, setStatus] = useState<DealsStatus>('loading');
  const [deals, setDeals] = useState<Deal[]>([]);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [moreError, setMoreError] = useState<string | null>(null);

  const pageRef = useRef(0);
  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    controllerRef.current = controller;

    setStatus('loading');
    setMoreLoading(false);
    setMoreError(null);

    fetchDeals({ query, storeID, sort }, 0, controller.signal)
      .then((result) => {
        if (result.length === 0) {
          setDeals([]);
          setStatus('empty');
          return;
        }
        pageRef.current = 0;
        setDeals(mergeDeals([], result));
        setHasMore(result.length >= PAGE_SIZE);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(describeError(err));
        setStatus('error');
      });

    return () => controllerRef.current?.abort();
  }, [query, storeID, sort, reloadKey]);

  const loadMore = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    setMoreLoading(true);
    setMoreError(null);

    try {
      const next = await fetchDeals({ query, storeID, sort }, pageRef.current + 1, controller.signal);
      pageRef.current += 1;
      setDeals((prev) => mergeDeals(prev, next));
      setHasMore(next.length >= PAGE_SIZE);
    } catch (err) {
      if (controller.signal.aborted) return;
      setMoreError(describeError(err));
    } finally {
      if (!controller.signal.aborted) setMoreLoading(false);
    }
  }, [query, storeID, sort]);

  return { status, deals, error, hasMore, moreLoading, moreError, loadMore };
}
