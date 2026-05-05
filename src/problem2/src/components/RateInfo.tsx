import type { Token } from '../types';
import { formatAmount } from '../lib/swap';

interface Props {
  from: Token | null;
  to: Token | null;
}

export function RateInfo({ from, to }: Props) {
  if (!from || !to || to.price === 0) return null;
  const rate = from.price / to.price;
  return (
    <div className="text-xs text-zinc-400 px-1">
      1 {from.symbol} ≈ {formatAmount(rate)} {to.symbol}
    </div>
  );
}
