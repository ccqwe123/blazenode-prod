import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  wallet_address: string;
  referral_code: string;
  referral_count: number;
  total_points_earned: number;
  confirmed: number;
  pending: number;
}

interface UserContextType {
  user: User | null;
  formattedWalletAddress: string;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [formattedWalletAddress, setFormattedWalletAddress] = useState('');

  useEffect(() => {
    axios.get('/api/me').then((response) => {
      const { referral_code, referral_count, total_points_earned, confirmed, pending, user } = response.data;
      setUser({
        wallet_address: user.wallet_address,
        referral_code,
        referral_count,
        total_points_earned,
        confirmed,
        pending,
      });
      setFormattedWalletAddress(formatWalletAddress(user.wallet_address));
    });
  }, []);

  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    const start = address.slice(0, 5);
    const end = address.slice(-5);
    return `${start} ••• ${end}`;
  };

  return (
    <UserContext.Provider value={{ user, formattedWalletAddress }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
