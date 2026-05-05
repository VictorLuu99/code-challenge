import { useEffect, useState } from 'react';
import type { Token } from '../types';
import { fetchTokens } from '../lib/api';

interface State {
  tokens: Token[];
  loading: boolean;
  error: string | null;
}

export function useTokenPrices(): State {
  const [state, setState] = useState<State>({ tokens: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    fetchTokens()
      .then((tokens) => {
        if (!cancelled) setState({ tokens, loading: false, error: null });
      })
      .catch((err: Error) => {
        if (!cancelled) setState({ tokens: [], loading: false, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
