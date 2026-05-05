import type { Token } from '../types';

export function calculateOutput(amount: number, from: Token, to: Token): number {
  if (!amount || !from || !to || to.price === 0) return 0;
  return (amount * from.price) / to.price;
}

export function formatAmount(value: number): string {
  if (!Number.isFinite(value) || value === 0) return '0';
  if (Math.abs(value) < 0.0001) return value.toExponential(4);
  return value.toLocaleString(undefined, {
    maximumFractionDigits: 6,
    minimumFractionDigits: 0,
  });
}

export function formatPrice(value: number): string {
  return value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value > 1 ? 2 : 6,
  });
}
