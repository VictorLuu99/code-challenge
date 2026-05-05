import type { Token } from '../types';

interface RawPrice {
  currency: string;
  date: string;
  price: number;
}

const PRICES_URL = 'https://interview.switcheo.com/prices.json';
const ICON_BASE = 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens';

export async function fetchTokens(): Promise<Token[]> {
  const res = await fetch(PRICES_URL);
  if (!res.ok) throw new Error(`Failed to load prices: ${res.status}`);
  const raw = (await res.json()) as RawPrice[];

  const latest = new Map<string, RawPrice>();
  for (const entry of raw) {
    if (!entry.price) continue;
    const existing = latest.get(entry.currency);
    if (!existing || new Date(entry.date) > new Date(existing.date)) {
      latest.set(entry.currency, entry);
    }
  }

  return [...latest.values()]
    .map((p) => ({
      symbol: p.currency,
      price: p.price,
      iconUrl: `${ICON_BASE}/${p.currency}.svg`,
    }))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));
}
