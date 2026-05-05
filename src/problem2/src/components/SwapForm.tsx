import { useMemo, useState } from 'react';
import type { Token } from '../types';
import { useTokenPrices } from '../hooks/useTokenPrices';
import { calculateOutput, formatAmount } from '../lib/swap';
import { SwapIcon } from '../lib/icons';
import { TokenAmountInput } from './TokenAmountInput';
import { TokenSelectorModal } from './TokenSelectorModal';
import { RateInfo } from './RateInfo';
import { SubmitButton } from './SubmitButton';

type Side = 'from' | 'to';

export function SwapForm() {
  const { tokens, loading, error } = useTokenPrices();
  const [from, setFrom] = useState<Token | null>(null);
  const [to, setTo] = useState<Token | null>(null);
  const [amount, setAmount] = useState('');
  const [picker, setPicker] = useState<Side | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const numericAmount = Number(amount);
  const validAmount =
    amount.trim() !== '' && Number.isFinite(numericAmount) && numericAmount > 0;
  const sameToken = from && to && from.symbol === to.symbol;

  const output = useMemo(() => {
    if (!from || !to || !validAmount) return 0;
    return calculateOutput(numericAmount, from, to);
  }, [from, to, numericAmount, validAmount]);

  const errorMessage = (() => {
    if (!from || !to) return 'Select both tokens';
    if (sameToken) return 'Pick two different tokens';
    if (amount.trim() === '') return 'Enter an amount';
    if (!validAmount) return 'Amount must be greater than zero';
    return null;
  })();

  const handleFlip = () => {
    setFrom(to);
    setTo(from);
  };

  const handlePick = (token: Token) => {
    if (picker === 'from') {
      if (to && to.symbol === token.symbol) setTo(from);
      setFrom(token);
    } else if (picker === 'to') {
      if (from && from.symbol === token.symbol) setFrom(to);
      setTo(token);
    }
    setPicker(null);
  };

  const handleSubmit = () => {
    if (errorMessage) return;
    setSubmitting(true);
    setToast(null);
    setTimeout(() => {
      setSubmitting(false);
      setToast(
        `Swapped ${formatAmount(numericAmount)} ${from!.symbol} for ${formatAmount(output)} ${to!.symbol}`,
      );
    }, 1500);
  };

  if (loading) return <div className="text-zinc-400 text-sm">Loading tokens...</div>;
  if (error) return <div className="text-red-400 text-sm">Failed to load tokens: {error}</div>;

  return (
    <>
      <div className="w-full max-w-md mx-auto rounded-3xl bg-zinc-950/70 backdrop-blur border border-zinc-800 p-5 shadow-2xl">
        <h1 className="text-xl font-semibold text-zinc-100 mb-4">Swap</h1>

        <div className="relative space-y-2">
          <TokenAmountInput
            label="From"
            amount={amount}
            token={from}
            onAmountChange={setAmount}
            onPickToken={() => setPicker('from')}
          />

          <button
            onClick={handleFlip}
            disabled={!from && !to}
            aria-label="Swap direction"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-full bg-zinc-900 border border-zinc-800 p-2 hover:rotate-180 transition disabled:opacity-50"
          >
            <SwapIcon className="w-4 h-4 text-zinc-300 rotate-90" />
          </button>

          <TokenAmountInput
            label="To"
            amount={output ? formatAmount(output) : ''}
            token={to}
            readOnly
            onPickToken={() => setPicker('to')}
          />
        </div>

        <div className="mt-3">
          <RateInfo from={from} to={to} />
        </div>

        <div className="mt-5">
          <SubmitButton
            loading={submitting}
            disabled={!!errorMessage}
            label={errorMessage ?? 'Confirm Swap'}
            onClick={handleSubmit}
          />
        </div>
      </div>

      <TokenSelectorModal
        open={picker !== null}
        tokens={tokens}
        excludeSymbol={picker === 'from' ? to?.symbol : from?.symbol}
        onSelect={handlePick}
        onClose={() => setPicker(null)}
      />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm text-zinc-100 shadow-xl">
          {toast}
        </div>
      )}
    </>
  );
}
