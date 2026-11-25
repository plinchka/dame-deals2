import type { Deal, Filters, SortKey, Store } from './types';

const API = 'https://www.cheapshark.com/api/1.0';
const REDIRECT = 'https://www.cheapshark.com/redirect';

export const PAGE_SIZE = 24;

const SORTS: Record<SortKey, { sortBy: string; desc: number } | null> = {
  none: null,
  priceDesc: { sortBy: 'Price', desc: 1 },
  priceAsc: { sortBy: 'Price', desc: 0 },
  reviews: { sortBy: 'Reviews', desc: 0 },
};

async function getJSON<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Сервер ответил с ошибкой ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export function describeError(error: unknown): string {
  if (error instanceof TypeError) {
    return 'Не удалось подключиться к серверу. Проверьте интернет.';
  }
  const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
  return `${message}. Попробуйте ещё раз.`;
}

export function fetchDeals(
  { query, storeID, sort }: Filters,
  page: number,
  signal: AbortSignal,
): Promise<Deal[]> {
  const params = new URLSearchParams({
    pageSize: String(PAGE_SIZE),
    pageNumber: String(page),
  });

  const sortParams = SORTS[sort];
  if (sortParams) {
    params.set('sortBy', sortParams.sortBy);
    params.set('desc', String(sortParams.desc));
  }

  const title = query.trim();
  if (title) params.set('title', title);
  if (storeID) params.set('storeID', storeID);

  return getJSON<Deal[]>(`${API}/deals?${params}`, signal);
}

export function fetchStores(signal: AbortSignal): Promise<Store[]> {
  return getJSON<Store[]>(`${API}/stores`, signal);
}

export function dealUrl(dealID: string): string {
  return `${REDIRECT}?dealID=${encodeURIComponent(dealID)}`;
}
