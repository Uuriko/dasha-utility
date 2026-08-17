import React from 'react';
import { useDashaBalance } from '../hooks/useDashaBalance';
import { ConnectButton } from './WalletProvider';

interface Props {
  children: React.ReactNode;
  requiredTier?: 'advanced' | 'full';
  fallback?: React.ReactNode;
}

export const GatedStudio: React.FC<Props> = ({
  children,
  requiredTier = 'advanced',
  fallback,
}) => {
  const { balance, tier, loading } = useDashaBalance();

  if (loading) {
    return <div className="dasha-gated loading">Checking holdings...</div>;
  }

  const hasAccess =
    requiredTier === 'advanced'
      ? tier === 'advanced' || tier === 'full'
      : tier === 'full';

  if (hasAccess) return <>{children}</>;

  const defaultFallback = (
    <div className="dasha-gated locked">
      <h3>Higher resolution is a privilege of those who hold the timeline.</h3>
      <p>
        {requiredTier === 'full'
          ? 'Hold at least 150,000 $DASHA to unlock the full Studio.'
          : 'Hold at least 50,000 $DASHA to unlock advanced tools and templates.'}
      </p>
      <p className="current">
        Current holdings: <strong>{balance.toLocaleString()}</strong> $DASHA
      </p>
      <div className="connect-area">
        <ConnectButton />
      </div>
    </div>
  );

  return <>{fallback || defaultFallback}</>;
};
