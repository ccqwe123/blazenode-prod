import React, { useEffect } from 'react';
import Header from './Headers';
import Sidebar from './Sidebar';
import { useSidebar } from '@/hooks/use-sidebar';
import { Toaster } from "@/Components/toaster";
import axios from 'axios';

const Authenticated: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { collapsed, isMobile } = useSidebar();
    useEffect(() => {
      const token = sessionStorage.getItem('auth_token');
      if (!token) {
          window.location.href = '/kill-user';
          return;
      }

      axios.get('/api/check-token', {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {
        sessionStorage.removeItem('auth_token');
        window.location.href = '/kill-user';
      });
    }, []);

    return (
        <>
            <Toaster />
            <Sidebar />
            <Header />

          <main className={`flex-1 pt-16 transition-all duration-300 ${
            isMobile ? 'ml-0' : (collapsed ? 'ml-[70px]' : 'ml-[300px]')
          }`}>
            <div className="container px-6 py-6 max-w-full lg:max-w-[1550px] mx-auto">
              {children}
            </div>
          </main>
        </>
    );
}
export default Authenticated;
