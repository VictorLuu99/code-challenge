import { useEffect, useState } from 'react';
import type { Token } from '../types';
import { CloseIcon, SearchIcon } from '../lib/icons';
import { formatPrice } from '../lib/swap';

interface Props {
  open: boolean;
  tokens: Token[];
  excludeSymbol?: string;
  onSelect: (token: Token) => void;
  onClose: () => void;
}

export function TokenSelectorModal({ open, tokens, excludeSymbol, onSelect, onClose }: Props) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!open) setQuery('');
  }, [open]);

  if (!open) return null;

  const filtered = tokens
    .filter((t) => t.symbol !== excludeSymbol)
    .filter((t) => t.symbol.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">Select a token</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100"
            aria-label="Close"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="px-5 py-3 border-b border-zinc-800">
          <div className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-2">
            <SearchIcon className="w-4 h-4 text-zinc-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by symbol"
              className="bg-transparent flex-1 outline-none text-sm text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-5 py-6 text-sm text-zinc-500 text-center">No tokens found</div>
          ) : (
            filtered.map((t) => (
              <button
                key={t.symbol}
                onClick={() => onSelect(t)}
                className="flex w-full items-center justify-between px-5 py-3 hover:bg-zinc-800 transition"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={t.iconUrl}
                    alt=""
                    className="w-7 h-7 rounded-full bg-zinc-800"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                    }}
                  />
                  <span className="font-medium text-zinc-100">{t.symbol}</span>
                </div>
                <span className="text-xs text-zinc-400">{formatPrice(t.price)}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
