import type { Token } from '../types';
import { ChevronDownIcon } from '../lib/icons';
import { formatPrice } from '../lib/swap';

interface Props {
  label: string;
  amount: string;
  token: Token | null;
  readOnly?: boolean;
  onAmountChange?: (value: string) => void;
  onPickToken: () => void;
}

export function TokenAmountInput({
  label,
  amount,
  token,
  readOnly,
  onAmountChange,
  onPickToken,
}: Props) {
  return (
    <div className="rounded-2xl bg-zinc-900 border border-zinc-800 p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-wider text-zinc-500">
        <span>{label}</span>
        {token && (
          <span>
            {formatPrice(token.price)} / {token.symbol}
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <input
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          readOnly={readOnly}
          onChange={(e) => onAmountChange?.(e.target.value)}
          className="flex-1 min-w-0 bg-transparent text-2xl font-semibold text-zinc-100 outline-none placeholder:text-zinc-600"
        />
        <button
          onClick={onPickToken}
          className="flex items-center gap-2 rounded-full bg-zinc-800 hover:bg-zinc-700 transition px-3 py-2"
        >
          {token ? (
            <>
              <img
                src={token.iconUrl}
                alt=""
                className="w-5 h-5 rounded-full"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.visibility = 'hidden';
                }}
              />
              <span className="text-sm font-medium text-zinc-100">{token.symbol}</span>
            </>
          ) : (
            <span className="text-sm font-medium text-zinc-300">Select token</span>
          )}
          <ChevronDownIcon className="w-4 h-4 text-zinc-400" />
        </button>
      </div>
    </div>
  );
}
