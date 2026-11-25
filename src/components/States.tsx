import { Button } from './Button';

export function Loading() {
  return (
    <div className="state">
      <div className="spinner" aria-hidden="true" />
      <p className="state__text">Загрузка…</p>
    </div>
  );
}

export function Empty() {
  return (
    <div className="state">
      <p className="state__text">Ничего не найдено</p>
      <p className="state__text state__sub">Измените название игры или выберите другой магазин.</p>
    </div>
  );
}

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state state_error">
      <p className="state__text">{message}</p>
      <Button onClick={onRetry}>Повторить</Button>
    </div>
  );
}
