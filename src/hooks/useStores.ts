import { useEffect, useState } from 'react';
import { fetchStores } from '../api';
import type { Store } from '../types';

export function useStores(): Store[] {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    fetchStores(controller.signal)
      .then(setStores)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  return stores;
}
