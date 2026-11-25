export interface Deal {
  dealID: string;
  title: string;
  storeID: string;
  thumb: string;
  salePrice: string;
  normalPrice: string;
  savings: string;
  steamRatingPercent: string;
}

export interface Store {
  storeID: string;
  storeName: string;
  isActive: string | number;
}

export type SortKey = 'none' | 'priceDesc' | 'priceAsc' | 'reviews';

export interface Filters {
  query: string;
  storeID: string;
  sort: SortKey;
}

export type DealsStatus = 'loading' | 'error' | 'empty' | 'success';
