import { dealUrl } from '../api';
import type { Deal } from '../types';

interface DealCardProps {
  deal: Deal;
  storeName?: string;
}

const formatPrice = (value: string) => `$${Number(value).toFixed(2)}`;

export function DealCard({ deal, storeName }: DealCardProps) {
  const discount = Math.round(Number(deal.savings));
  const rating = Number(deal.steamRatingPercent);

  return (
    <li className="card">
      <img className="card__image" src={deal.thumb} alt="" loading="lazy" />
      <h2 className="card__title">{deal.title}</h2>
      <p className="card__store">{storeName ?? `Магазин №${deal.storeID}`}</p>

      <div className="card__prices">
        <strong className="card__price">{formatPrice(deal.salePrice)}</strong>
        {discount > 0 && (
          <>
            <s className="card__old-price">{formatPrice(deal.normalPrice)}</s>
            <span className="badge">−{discount}%</span>
          </>
        )}
      </div>

      {rating > 0 && (
        <p className="card__reviews">Положительных отзывов в Steam: {rating}%</p>
      )}

      <a className="card__link" href={dealUrl(deal.dealID)} target="_blank" rel="noopener noreferrer">
        Открыть в магазине
      </a>
    </li>
  );
}
