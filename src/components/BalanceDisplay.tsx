import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useDashaBalance } from '../hooks/useDashaBalance';

export const BalanceDisplay: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const { balance, tier, loading, error, refresh } = useDashaBalance();

  if (!connected || !publicKey) {
    return (
      <div className="dasha-balance public">
        <span>Connect wallet to see your $DASHA</span>
      </div>
    );
  }

  if (loading) {
    return <div className="dasha-balance loading">Reading the timeline...</div>;
  }

  if (error) {
    return (
      <div className="dasha-balance error">
        <span>{error}</span>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }

  const tierLabel = {
    public: 'Public',
    advanced: 'Advanced',
    full: 'Full Access',
  }[tier];

  return (
    <div className={`dasha-balance tier-${tier}`}>
      <div className="balance-amount">
        {balance.toLocaleString(undefined, { maximumFractionDigits: 0 })} $DASHA
      </div>
      <div className="balance-tier">{tierLabel}</div>
      <button className="refresh-btn" onClick={refresh} title="Refresh">
        ↻
      </button>
    </div>
  );
};
