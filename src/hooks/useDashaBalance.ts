import { useCallback, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { getAssociatedTokenAddress, getAccount } from '@solana/spl-token';

export const DASHA_MINT = new PublicKey('53uxQtB9pcjWvCHguz3JTTndvuKqGxhrD37EetnCpump');

const DECIMALS = 6;

export type DashaTier = 'public' | 'advanced' | 'full';

export interface DashaBalanceState {
  balance: number;
  rawBalance: bigint;
  tier: DashaTier;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashaBalance(): DashaBalanceState {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [balance, setBalance] = useState(0);
  const [rawBalance, setRawBalance] = useState<bigint>(0n);
  const [tier, setTier] = useState<DashaTier>('public');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(0);
      setRawBalance(0n);
      setTier('public');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ata = await getAssociatedTokenAddress(DASHA_MINT, publicKey);
      const account = await getAccount(connection, ata);
      const raw = account.amount;
      const human = Number(raw) / Math.pow(10, DECIMALS);
      setRawBalance(raw);
      setBalance(human);
      if (human >= 150_000) setTier('full');
      else if (human >= 50_000) setTier('advanced');
      else setTier('public');
    } catch (err: any) {
      setBalance(0);
      setRawBalance(0n);
      setTier('public');
      if (err?.name !== 'TokenAccountNotFoundError') {
        setError(err?.message || 'Failed to fetch balance');
      }
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, rawBalance, tier, loading, error, refresh: fetchBalance };
}
