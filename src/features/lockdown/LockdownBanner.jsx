import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useLockdown } from './LockdownContext';

const LockdownBanner = () => {
  const { lockdownState, loading } = useLockdown();

  if (loading || !lockdownState.active) return null;

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#dc2626',
      color: '#ffffff',
      padding: '0.75rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.75rem',
      fontWeight: 'bold',
      zIndex: 9999,
      position: 'fixed',
      top: 0,
      left: 0,
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <ShieldAlert size={24} className="animate-pulse" />
      <span>⚠ System under security lockdown — contact your administrator</span>
    </div>
  );
};

export default LockdownBanner;
