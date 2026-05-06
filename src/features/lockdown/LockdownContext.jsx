import React, { createContext, useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';

const LockdownContext = createContext();

export const LockdownProvider = ({ children }) => {
  const [lockdownState, setLockdownState] = useState({ active: false, reason: '' });
  const [loading, setLoading] = useState(true);

  const fetchLockdownStatus = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/lockdown/status');
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          // If state changed to active, show a global warning
          if (!lockdownState.active && result.data.active) {
             toast.error('System Lockdown Activated!');
          }
          setLockdownState(result.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch lockdown status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLockdownStatus();
    const interval = setInterval(fetchLockdownStatus, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [lockdownState.active]);

  return (
    <LockdownContext.Provider value={{ lockdownState, fetchLockdownStatus, loading }}>
      {children}
    </LockdownContext.Provider>
  );
};

export const useLockdown = () => useContext(LockdownContext);
