import React, { createContext, useContext, useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

type SidebarContextType = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const [mobileOpen, setMobileOpen] = useState(false);

  // On mobile, default to collapsed
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
      setMobileOpen(false);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  return (
    <SidebarContext.Provider value={{
      collapsed,
      setCollapsed,
      mobileOpen,
      setMobileOpen,
      isMobile,
      toggleSidebar
    }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = (): SidebarContextType => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
