import React, { useEffect, useState } from 'react';
import { Cpu, ChevronRight } from 'lucide-react';
import { Button } from '@/Components/button';
import MineButton from '@/Components/MineButton';
import axios from '@/lib/axios';
import { Skeleton } from '@/Components/skeleton';
import { Miner } from '@/interface/miners';

interface MiningStatsProps {
    isLoading: boolean;
    miners: Miner[];
}
const MinerSkeleton = () => (
    <div className="my-2">
      <div className="border border-none bg-card text-card-foreground card-shadow relative rounded-xl">
        <div className="flex flex-col lg:flex-row lg:items-center w-full gap-5 p-5 lg:p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-3 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-5 w-32 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="bg-border h-[1px] w-full hidden lg:flex flex-1" />
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-5">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-5">
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
      </div>
    </div>
);
const NodesList = ({ isLoading, miners }: MiningStatsProps) => {

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-roller-primary" />
          Active Nodes
        </h2>
        <Button variant="ghost" className="text-white/70 hover:text-white transition-colors">
          View All <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {isLoading ? (
        <>
          <MinerSkeleton />
          <MinerSkeleton />
          <MinerSkeleton />
          <MinerSkeleton />
        </>
      ) : (
        miners.map((miner) => (
          <div key={miner.id} className="my-2">
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
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NodesList;
