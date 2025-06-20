import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import MiningStats from '@/Layouts/MiningStats';
import MinersList from '@/Layouts/NodesList';
import { SidebarProvider } from '@/hooks/use-sidebar';
import axios from '@/lib/axios';
import { Miner } from '@/interface/miners';

interface User {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

interface DashboardProps {
  auth: {
    user: User;
  };
}

export default function Dashboard({ auth }: DashboardProps) {
    const [miners, setMiners] = useState<Miner[]>([]);
    const [minerslist, setMinersList] = useState<Miner[]>([]);
    const [minersCount, setMinersCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMiner = async () => {
        try {
            const res = await axios.get('/api/user/nodes');
            setMiners(res.data.miners);
            setMinersList(res.data.miners);
            setMinersCount(res.data.miner_count);
        } catch (e) {
            console.error('Failed to load miner', e);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchMiner();
        const interval = setInterval(fetchMiner, 3 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);
    const DashboardContent = () => {
        return (
          <>
            <MiningStats
                isLoading={isLoading}
                miners={miners}
                minersCount={minersCount}
                onRefetchMiner={fetchMiner}
            />
            <MinersList isLoading={isLoading} miners={minerslist} />
          </>
        );
    };
    return (
        <SidebarProvider>
            <AuthenticatedLayout>

                <Head title="Dashboard" />

                <DashboardContent />
            </AuthenticatedLayout>
        </SidebarProvider>
    );
}


