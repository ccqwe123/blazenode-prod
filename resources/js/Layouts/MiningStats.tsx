import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Zap, Clock, Database, Cpu, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/card';
import { useCountdown } from '@/hooks/use-countdown';
import axios from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { eachDayOfInterval, format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import '../Components/MineButton.css';
import { Miner } from '@/interface/miners';
import { StatSkeleton, StatCardSkeleton, ChartSkeleton } from '@/hooks/use-skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import PulseCircle from '@/Components/PulseCircle';
import MineButton from '@/Components/MineButton';

interface ChartData {
    name: string;
    points: number;
    referral: number;
}
interface MiningStatsProps {
    isLoading: boolean;
    miners: Miner[];
    minersCount: number;
    onRefetchMiner: () => Promise<void>;
}

const MiningStats = React.memo(({ miners, isLoading, minersCount, onRefetchMiner }: MiningStatsProps) => {
    const { toast } = useToast();
    const [miner, setMiner] = useState<Miner | null>(miners[0] || null);
    const [isLoadingCard, setIsLoading] = useState(true);
    const [countMiner, setMinerCount] = useState(minersCount || 0);
    const [isLoadingStart, setIsLoadingStart] = useState(false);
    const [hasShownToast, setHasShownToast] = useState(false);
    const [endTime, setEndTime] = useState<string | null>(miner?.mining_ends_at ?? null);
    useEffect(() => {
        setEndTime(miner?.mining_ends_at ?? null);
    }, [miner?.mining_ends_at]);
    const { timeLeft, isFinished } = useCountdown(miner?.mining_ends_at ?? null);
    const [totalAllTime, setTotalAllTime] = useState(0);
    const [totalToday, setTotalToday] = useState(0);
    const [totalHashPower, setTotalHashPower] = useState(0);
    axios.defaults.withCredentials = true;
    const [data, setData] = useState<ChartData[]>([]);
    const daysOfMonth = eachDayOfInterval({
        start: startOfMonth(new Date()),
        end: endOfMonth(new Date()),
      }).map((date) => ({
        name: format(date, 'MMM d'),
        points: 0,
        referral: 0,
    }));
    useEffect(() => {
        if (miners.length > 0) {
          setMiner(miners[0]);
        }
      }, [miners]);
    useEffect(() => {
        const fetchChartPoints = async () => {
            try {
                const response = await axios.get('/api/user/points/daily');

                const formatted = response.data.map((entry: any) => ({
                    name: format(parseISO(entry.date), 'MMM d'),
                    points: parseFloat(entry.points),
                    referral: parseFloat(entry.referralEarnings) || 0,
                }));
                const merged = daysOfMonth.map((day) => {
                    const existing = formatted.find((item: ChartData) => item.name === day.name);
                    return existing ? { ...day, points: existing.points, referral: existing.referral } : day;
                });
                setData(merged);
            } catch (error) {
              console.error('Failed to fetch daily points:', error);
            } finally {
                console.log("finished fetching points");
            }
        };

        fetchChartPoints();
    }, []);
    const fetchPoints = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('/api/user/points');
            setTotalAllTime(res.data.total_points);
            setTotalToday(res.data.total_points_today);
            setTotalHashPower(res.data.totalHashPower);
        } catch (error) {
            console.error('Failed to fetch point summary:', error);
        }finally {
            setIsLoading(false);
            // setIsLoadingCard(false);
        }
    };
    useEffect(() => {
        fetchPoints();
        const interval = setInterval(fetchPoints, 3 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!miner?.mining_ends_at) return;

        const endTime = new Date(miner.mining_ends_at).getTime();
        const now = new Date().getTime();
        const delay = endTime - now;

        if (delay <= 0) return;

        const timeout = setTimeout(() => {
            toast({
                title: "Mining Stopped",
                description: "Your miner has finished. Click start to mine again.",
            });
        }, delay);

        return () => clearTimeout(timeout);
    }, [miner?.mining_ends_at]);
    const handleStart = async () => {
        if (!miner || !isFinished) return;
        setIsLoadingStart(true);
        try {
            await axios.post(`/api/nodes/${miner.id}/start`);
            await onRefetchMiner();
            setHasShownToast(false);
            toast({
                title: "Mining Started",
                description: "Your miner is now active. Happy mining!",
                duration: 5000,
                draggable: true,
                style: {
                    backgroundColor: "#6652d3",
                    borderColor: "rgba(123, 97, 255, 0.3)",
                    color: "white",
                    borderRadius: "6px",
                    opacity: 0.9,
                },
            });
        }catch (e) {
            console.log(e)
            alert('Failed to start miner');
        } finally {
            setIsLoadingStart(false);
        }
    };
    if (isLoading) {
        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <ChartSkeleton />
          </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-full text-black-1 text-3xl md:text-4xl font-medium flex-row-center flex-justify-start my-5">GM, Blazers! 👋</div>
            <Card className="roller-card h-[150px] md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-roller-accent" />
                        Hash Power
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-end justify-between">
                        <div>
                            <p className="text-2xl font-bold text-white">{Number(totalHashPower).toFixed(4)} H/s</p>
                            <p className="text-xs text-white/60 flex items-center mt-1">
                                <ArrowUpRight className="w-3 h-3 mr-1" />
                                Total Hashpower of all nodes
                            </p>
                        </div>
                        <div className="bg-white bg-opacity-5 p-2 rounded-lg">
                            <Cpu className="w-5 h-5 text-roller-primary" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="roller-card md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-roller-accent" />
                    Apoc 0 Earnings
                </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-end justify-between">
                    <div>
                    <p className="text-2xl font-bold text-white">{Number(totalAllTime).toFixed(6)}</p>
                    <p className="text-xs text-white/60 mt-1">
                        Total points earned in current apoc
                    </p>
                    </div>
                    <div className="bg-white bg-opacity-5 p-2 rounded-lg">
                    <Clock className="w-5 h-5 text-roller-accent" />
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card className="roller-card md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-roller-accent" />
                    Today's Earnings
                </CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-end justify-between">
                    <div>
                    <p className="text-2xl font-bold text-white">{Number(totalToday).toFixed(6)}</p>
                    <p className="text-xs text-white/60 mt-1">
                        Total points mined today
                    </p>
                    </div>
                    <div className="bg-white bg-opacity-5 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-roller-accent" />
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card className="roller-card md:col-span-2 lg:col-span-1 flex flex-col justify-between">
                <CardHeader className="pb-2">
                    <div className="flex items-end justify-between">
                        <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
                        <PulseCircle variant={isFinished ? 'danger' : 'success'} size={10} />
                            {isFinished ? 'Stopped' : 'Running'}
                        </CardTitle>
                        <CardTitle className="text-sm font-medium text-white/70 flex items-center gap-2">
                            <Database className="w-4 h-4 text-roller-accent" />
                            Total Active Node: {countMiner.toString()}
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                <div className="flex items-end justify-between mt-3">
                    <MineButton
                        text={isLoadingStart ? 'Starting...' : isFinished ? 'Start Mining' : timeLeft}
                        variant={isFinished ? 'danger' : 'success'}
                        onClick={handleStart}
                        disabled={isLoadingStart}
                    />
                </div>
                </CardContent>
            </Card>

            <Card className="roller-card md:col-span-4">
                <CardHeader className="pb-2">
                    <CardTitle className="text-white">Earnings Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                    >
                    <defs>
                        <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#7B61FF" stopOpacity={0} />
                        </linearGradient>
                        {/* Gradient for referral earnings */}
                        <linearGradient id="colorReferral" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="skyblue" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="skyblue" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis
                        dataKey="name"
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <YAxis
                        stroke="rgba(255,255,255,0.5)"
                        tick={{ fill: 'rgba(255,255,255,0.5)' }}
                    />
                    <Tooltip
                        cursor={false}
                        contentStyle={{
                        backgroundColor: '#282554',
                        borderColor: 'rgba(123, 97, 255, 0.3)',
                        color: 'white',
                        }}
                        labelStyle={{ color: 'white' }}
                    />
                    {/* Bar for points */}
                    <Bar
                        type="monotone"
                        dataKey="points"
                        stackId="a"
                        stroke="#7B61FF"
                        fillOpacity={1}
                        fill="url(#colorPower)"
                    />
                    {/* Bar for referral earnings */}
                    <Bar
                        type="monotone"
                        dataKey="referral"
                        stackId="a"
                        stroke="skyblue"
                        fillOpacity={1}
                        fill="url(#colorReferral)"
                    />
                    </BarChart>
                </ResponsiveContainer>
                </div>
            </CardContent>
            </Card>
        </div>
    );
});

export default MiningStats;
