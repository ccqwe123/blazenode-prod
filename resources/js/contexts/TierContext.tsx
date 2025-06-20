import { createContext, useContext, useState } from 'react';

interface TierContextType {
  currentTierLevelName: string;
  setCurrentTierLevelName: (level: string) => void;
}

const TierContext = createContext<TierContextType>({
  currentTierLevelName: '',
  setCurrentTierLevelName: () => {},
});

export const TierProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTierLevelName, setCurrentTierLevelName] = useState('');

  return (
    <TierContext.Provider value={{ currentTierLevelName, setCurrentTierLevelName }}>
      {children}
    </TierContext.Provider>
  );
};

export const useTier = () => useContext(TierContext);
