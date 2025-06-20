import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/card";
import { Skeleton } from "@/Components/skeleton";
import { Cpu, Zap, Activity, Database, Gauge } from 'lucide-react';

export const StatSkeleton = () => (
    <Skeleton className="col-span-full flex-row-center flex-justify-start my-7 h-5 w-[200px]" />
);

export  const StatCardSkeleton = () => (
    <Card className="roller-card h-[150px] md:col-span-2 lg:col-span-1 flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-white/70">
          <Skeleton className="h-4 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <Skeleton className="h-8 w-24 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </CardContent>
    </Card>
);

export const ChartSkeleton = () => (
    <Card className="roller-card md:col-span-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-white">
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <div className="flex items-center justify-center h-full">
            <div className="space-y-3 w-full px-8">
              <Skeleton className="h-[150px]" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
);

export const MinerSkeleton = () => (
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
        </div>
      </div>
    </div>
);
export const NodeSkeleton = () => (
    <div className="my-2">
      <div className="border border-zinc-900 bg-card text-card-foreground card-shadow relative rounded-xl">
        <div className="flex flex-col lg:flex-row lg:items-center w-full gap-5 p-5 lg:p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-3 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-3 w-16 mb-1" />
              <Skeleton className="h-2 w-8" />
            </div>
          </div>
          <div className="border-zinc-900 border h-[1px] w-full hidden lg:flex flex-1" />
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-5">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-5">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-5 w-[100px]">
            <Skeleton className="h-8 w-48" />
          </div>
        </div>
      </div>
    </div>
);
export const NodeStatsSkeleton = () => (
    <div className="mb-6 border border-zinc-800 p-4 md:p-6 rounded-xl h-auto md:h-[200px] flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 w-full">
        <div className="flex flex-col items-center justify-center py-4 md:py-0">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5" />
            <span className="text-lg font-medium">Active Miners</span>
          </div>
          <Skeleton className="text-4xl font-bold text-white w-[100px] h-10" />
        </div>

        <div className="relative flex flex-col items-center justify-center py-4 md:py-0">
          <div className="absolute left-0 top-1/4 md:top-0 bottom-1/4 md:bottom-0 w-px bg-gradient-to-b from-transparent via-roller-primary/50 to-transparent" />
          <div className="absolute right-0 top-1/4 md:top-0 bottom-1/4 md:bottom-0 w-px bg-gradient-to-b from-transparent via-roller-primary/50 to-transparent" />
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5" />
            <span className="text-lg font-medium">Points Earned</span>
          </div>
          <Skeleton className="text-4xl font-bold text-white w-[100px] h-10" />
        </div>

        <div className="flex flex-col items-center justify-center py-4 md:py-0">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-5 h-5" />
            <span className="text-lg font-medium">Total Hash Power</span>
          </div>
          <Skeleton className="text-4xl font-bold text-white w-[100px] h-10" />
        </div>
      </div>
    </div>
);
