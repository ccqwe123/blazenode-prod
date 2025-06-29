import React, { useEffect, useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useSidebar, SidebarProvider } from '@/hooks/use-sidebar';
import { NodeSkeleton, NodeStatsSkeleton } from '@/hooks/use-skeleton';
import { Cpu, Zap, Activity, Database, Gauge } from 'lucide-react';
import MineButton from '@/Components/MineButton';
import { Miner } from '@/interface/miners';
import axios from '@/lib/axios';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/Components/hover-card';
import { Dialog, DialogContent, DialogTrigger } from '@/Components/dialog';

const upgradeCosts: { [level: number]: string } = {
    1: '10.0000000',
    2: '10.5000000',
    3: '15.5500000',
    4: '20.0000000',
};
const getNextUpgradeCost = (level: number) => {
    return upgradeCosts[level] ? `${upgradeCosts[level]} pts` : 'Max Level';
};

const MinersContent = () => {
    const { collapsed, isMobile } = useSidebar();
    const [isLoading, setIsLoading] = React.useState(true);
    const [miners, setMinersList] = useState<Miner[]>([]);
    const [terminalLines, setTerminalLines] = useState<string[]>([]);
    const [isUpgrading, setIsUpgrading] = useState(false);
    const [nodecount, setNodeCount] = useState(0);
    const [totalPoints, setTotalPoints] = useState(0);
    const [totalPower, setTotalPower] = useState(0);
    const terminalEndRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [terminalLines]);
    const startUpgrade = async (nodeId: string) => {
        setIsUpgrading(true);
        setTerminalLines([]);
        const steps = [
            { text: "Checking balance...", delay: 3000 },
            { text: "Initializing upgrade...", delay: 1200 },
            { text: "Connecting to node...", delay: 4500 },
            { text: "Backing up current version...", delay: 5000 },
            { text: "Downloading new binaries...", delay: 300 },
            { text: "[█- - - - - - - - - - - - - - - - - - - - - - - -] 1%", delay: 100 },
            { text: "[███- - - - - - - - - - - - - - - - - - - - - - -] 4%", delay: 500 },
            { text: "[█████- - - - - - - - - - - - - - - - - - - - - -] 8%", delay: 100 },
            { text: "[███████- - - - - - - - - - - - - - - - - - - - -] 14%", delay: 100 },
            { text: "[█████████- - - - - - - - - - - - - - - - - - - -] 16%", delay: 100 },
            { text: "[██████████- - - - - - - - - - - - - - - - - - - ] 18%", delay: 1000 },
            { text: "[████████████ - - - - - - - - - - - - - - - - - -] 23%", delay: 100 },
            { text: "[██████████████ - - - - - - - - - - - - - - - - -] 27%", delay: 100 },
            { text: "[████████████████ - - - - - - - - - - - - - - - -] 30%", delay: 100 },
            { text: "[███████████████████- - - - - - - - - - - - - - -] 35%", delay: 100 },
            { text: "[████████████████████- - - - - - - - - - - - - - ] 36%", delay: 100 },
            { text: "[██████████████████████ - - - - - - - - - - - - -] 40%", delay: 100 },
            { text: "[█████████████████████████ - - - - - - - - - - - ] 50%", delay: 100 },
            { text: "[██████████████████████████ - - - - - - - - - - -] 52%", delay: 100 },
            { text: "[███████████████████████████ - - - - - - - - - - ] 55%", delay: 100 },
            { text: "[█████████████████████████████- - - - - - - - - -] 60%", delay: 3000 },
            { text: "[███████████████████████████████ - - - - - - - - ] 68%", delay: 100 },
            { text: "[█████████████████████████████████ - - - - - - - ] 72%", delay: 1500 },
            { text: "[██████████████████████████████████ - - - - - - -] 75%", delay: 100 },
            { text: "[█████████████████████████████████████ - - - - - ] 79%", delay: 1500 },
            { text: "[███████████████████████████████████████ - - - - ] 83%", delay: 4000 },
            { text: "[█████████████████████████████████████████ - - - ] 88%", delay: 1000 },
            { text: "[███████████████████████████████████████████ - - ] 91%", delay: 100 },
            { text: "[██████████████████████████████████████████████ -] 95%", delay: 500 },
            { text: "[████████████████████████████████████████████████] 100%", delay: 4000 },
            { text: "Installing upgrade...", delay: 1500 },
            { text: "Finalizing...", delay: 1000 },
            { text: "Upgrade complete.", delay: 5500 },
            { text: "Done", delay: 2500 }
        ];
        try {
            setTerminalLines(["Checking balance..."]);

            const res = await axios.post('/api/user/node/upgrade/step1', {
                node_id: nodeId,
            });

            for (const step of steps.slice(1)) { // skip first because it's already shown
                await new Promise(resolve => setTimeout(resolve, step.delay));
                setTerminalLines(prev => [...prev, step.text]);
            }
            await axios.post('/api/user/node/upgrade/complete', {
                node_id: nodeId,
            });
            setIsUpgrading(false);
            await fetchMiner();
        } catch (err: any) {
            const message = err.response?.data?.message || 'Upgrade failed';
            setTerminalLines(prev => [...prev, `${message}`]);
            await new Promise((resolve) => setTimeout(resolve, 3000));
            setIsUpgrading(false);
        }
    };
    const fetchMiner = async () => {
        try {
            const res = await axios.get('/api/user/nodes');
            setMinersList(res.data.miners);
            setNodeCount(res.data.miner_count);
            setTotalPoints(res.data.totalPoints);
            setTotalPower(res.data.totalPower);
        } catch (e) {
            console.error('Failed to load miner', e);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
            fetchMiner();
        }, 3000);
        return () => clearTimeout(timer);
      }, []);
    const statsCard = (
        <div className="mb-6 border border-zinc-800 p-4 md:p-6 rounded-xl h-auto md:h-[200px] flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 w-full">
            <div className="flex flex-col items-center justify-center py-4 md:py-0">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5" />
                <span className="text-lg font-medium">Active Nodes</span>
              </div>
              <span className="text-4xl font-bold text-white">{nodecount}</span>
            </div>

            <div className="relative flex flex-col items-center justify-center py-4 md:py-0">
              <div className="absolute left-0 top-1/4 md:top-0 bottom-1/4 md:bottom-0 w-px bg-gradient-to-b from-transparent via-roller-primary/50 to-transparent" />
              <div className="absolute right-0 top-1/4 md:top-0 bottom-1/4 md:bottom-0 w-px bg-gradient-to-b from-transparent via-roller-primary/50 to-transparent" />
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-5 h-5" />
                <span className="text-lg font-medium">Points Earned</span>
              </div>
              <span className="text-4xl font-bold text-white">{totalPoints}</span>
            </div>

            <div className="flex flex-col items-center justify-center py-4 md:py-0">
              <div className="flex items-center gap-2  mb-2">
                <Gauge className="w-5 h-5" />
                <span className="text-lg font-medium">Total Hash Power</span>
              </div>
              <span className="text-4xl font-bold text-white">{totalPower} H/s</span>
            </div>
          </div>
        </div>
    );
    return (
    <div className="mt-6">

      {isLoading ? (
        <>
          <NodeStatsSkeleton />
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-roller-primary" />
                    Active Nodes
                </h2>
            </div>
          <NodeSkeleton />
          <NodeSkeleton />
          <NodeSkeleton />
          <NodeSkeleton />
          <NodeSkeleton />
          <NodeSkeleton />
        </>
      ) : (
        <>
        {statsCard}
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-roller-primary" />
                Active Nodes
            </h2>
        </div>
        {miners.map((miner) => (
        <HoverCard key={miner.id}>
            <HoverCardTrigger>
                <div key={miner.id} className="my-2 transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:shadow-lg">
                    <div className="border border-zinc-900 bg-card text-card-foreground card-shadow relative rounded-xl">
                    <div className="flex flex-col lg:flex-row lg:items-center w-full gap-5 p-5 lg:p-6">
                        <div className="flex items-center gap-4">
                        <div className="flex justify-center">
                            <div className={`h-3 w-3 animate-pulse rounded-full ${miner.is_active ? 'bg-green-700' : 'bg-red-700'}`}></div>
                        </div>
                        <div className="flex-1">
                            <h3 className="tracking-tight text-base font-semibold transition-colors duration-300 ease-out text-online">
                            {miner.name}
                            </h3>
                            <p className="text-[10px] text-muted-foreground">Lv. {miner.level}</p>
                        </div>
                        </div>
                        <div className="border-zinc-900 border h-[1px] w-full hidden lg:flex flex-1" />
                        <div className="flex flex-col lg:flex-row gap-3 lg:gap-5">
                            <div className="flex items-center bg-gray-900 rounded-lg overflow-hidden">
                                <div className="w-[4.625rem] lg:w-auto border-r border-none px-3 py-1.5 text-xs text-contrast-low font-medium bg-gray-500 text-white">Node IP</div>
                                <div className="flex items-center flex-1 gap-3 px-3 text-xs text-contrast-high font-medium">{miner.ip_address}</div>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-3 lg:gap-5">
                            <div className="flex items-center bg-gray-900 rounded-lg overflow-hidden">
                                <div className="w-[4.625rem] lg:w-auto border-r border-none px-3 py-1.5 text-xs text-contrast-low font-medium bg-gray-500 text-white">Earned Points</div>
                                <div className="flex items-center flex-1 gap-3 px-3 text-xs text-contrast-high font-medium">{miner.earned_points}</div>
                            </div>
                        </div>
                        <Dialog open={isUpgrading} onOpenChange={() => {}} modal={true}>
                            <DialogTrigger asChild>

                                <div className="flex flex-col lg:flex-row gap-3 lg:gap-5">
                                    <div className="flex items-center bg-border rounded-lg overflow-hidden">
                                        <MineButton
                                            className="py-5 w-[100px]"
                                            text={Number(miner.level) >= 5 ? "Max" : "Upgrade"}
                                            variant="default"
                                            onClick={() => startUpgrade(miner.node_id)}
                                            disabled={miner.level >= 5}
                                        />
                                    </div>
                                    <span className="block md:hidden text-xs text-gray-300 text-center text-shadow-lg">
                                    {miner.level < 5 ? (
                                        <>
                                        Upgrade node to level {miner.level + 1}:{' '}
                                        <span className="text-yellow-500">{getNextUpgradeCost(miner.level)}</span> pts.
                                        </>
                                    ) : (
                                        'Max Level reached'
                                    )}
                                    </span>
                                </div>
                            </DialogTrigger>
                            <DialogContent
                                    onPointerDownOutside={(e) => e.preventDefault()}
                                    onEscapeKeyDown={(e) => e.preventDefault()}
                                    className="bg-black/95 border-gray-800 h-[280px] select-none text-gray-500 font-mono p-4 shadow-lg max-w-xl mx-5 rounded-lg">
                                <div className="space-y-4">
                                    <div className="h-[250px] overflow-y-auto space-y-1 text-xs scrollbar-thin scrollbar-thumb-gray-700">
                                        <span className="text-green-500">root@{miner.ip_address}:~$:</span><span className="text-gray-500"> winget blazenode node --upgrade</span>
                                        {terminalLines.map((line, index) => (
                                            <div key={index}>
                                                {line}
                                                {index === terminalLines.length - 1 && isUpgrading && (
                                                    <span className="ml-1 animate-pulse">▋</span>
                                                )}
                                            </div>
                                        ))}
                                        <div ref={terminalEndRef} />
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                    </div>
                </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-roller-dark border-roller-primary/30 text-white">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">{miner.name} Details</h4>
                <div className="text-xs space-y-1">
                  <p>Level: {miner.level}</p>
                  <p>Next Upgrade Cost: {getNextUpgradeCost(miner.level)}</p>
                  <p>Total Earned Points: {miner.earned_points}</p>
                  <p>Status: {miner.is_active ? 'Active' : 'Inactive'}</p>
                  <p>IP Address: {miner.ip_address}</p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
        </>
      )}
    </div>
  );
};
export default function Nodes() {
    console.log("miners mounted");
  return (
    <SidebarProvider>
        <AuthenticatedLayout>
        <Head title="Nodes" />
            <MinersContent />
        </AuthenticatedLayout>
    </SidebarProvider>
  );
}
