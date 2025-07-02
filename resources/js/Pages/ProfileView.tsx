import React, { useEffect, useState, useRef } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useSidebar, SidebarProvider } from '@/hooks/use-sidebar';
import axios from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Users, Link as LinkIcon, Copy, UserPlus, Gift, BadgeCheck, Info, Coins } from 'lucide-react';
import ReferralTier from '@/Components/ReferralTier';
import { ArrowRight } from 'lucide-react';

const ProfileView = () => {
    const { toast } = useToast();
    const [referralCount, setReferralCount] = useState(0);
    const [totalRefPoints, seTotalRefPoints] = useState(0);
    const [refcode, seRefCode] = useState('');
    const [currentTierLevel, setCurrentTierLevel] = useState<string>('');
    const [currentBonusPoints, setCurrentBonusPoints] = useState<number>(0);
    const [confirmed, setConfirmed] = useState(0);
    const [pending, setPending] = useState(0);
    const handleTierChange = (tier: string, points: number) => {
        console.log("Received in Referral.tsx:", tier, points);
        setCurrentTierLevel(tier);
        setCurrentBonusPoints(points);
      };
    useEffect(() => {
        axios.get('/api/me').then(response => {
        console.log(response.data);
          const { base_url, referral_code, referral_count, total_points_earned, confirmed, pending } = response.data;
          setConfirmed(confirmed)
          setPending(pending)
          setReferralCount(referral_count);
          seTotalRefPoints(total_points_earned);
          seRefCode(referral_code);
        });
    }, []);
    const handleCopyRef = () => {
      navigator.clipboard.writeText(refcode);
      toast({
        title: "Link copied!",
        description: "Referral link copied to clipboard",
      });
    };

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-6">
          <div className="border border-zinc-900 bg-opacity-5 rounded-2xl p-7">
              <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-white bg-opacity-5 rounded-lg">

                      <Coins size={20} className="" />
                  </div>
                  <span className="font-semibold">Referral Rewards</span>
                  <Info size={16} className="text-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                  <div>
                      <div className="md:text-sm sm:text-xs text-[11px] text-gray-400 mt-5">Total Points</div>
                      <div className="md:text-3xl sm:text-xl  font-bold">{ totalRefPoints.toFixed(8) }</div>
                      <div className="md:text-sm sm:text-xs text-[11px] text-gray-400">Points earned from referrals</div>
                  </div>
                  <div>
                      <div className="md:text-sm sm:text-xs text-[11px] text-gray-400 mt-5">Current Rank</div>
                      <div className="md:text-3xl sm:text-xl  font-bold">{ referralCount > 0 ? currentTierLevel : "-"}</div>
                      <div className="md:text-sm sm:text-xs text-[11px] text-gray-400">Reward: {referralCount > 0 ? currentBonusPoints.toFixed(8) : "-"}</div>
                  </div>
              </div>
          </div>

          <div className="bg-white bg-opacity-5 rounded-2xl p-6 space-y-16">
              <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-2">
                      <div className="p-2 bg-green-500 bg-opacity-20 rounded-lg">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                              <circle cx="9" cy="7" r="4" />
                              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                      </div>
                      <span className="font-semibold">Referrals</span>
                      <Info size={16} className="text-gray-500" />
                  </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                  <div>
                      <div className="text-sm text-gray-400">Confirmed</div>
                      <div className="md:text-3xl sm:text-xl font-bold">{confirmed}</div>
                  </div>
                  <div>
                      <div className="text-sm text-gray-400 mb-1">Pending</div>
                      <div className="md:text-3xl sm:text-xl  font-bold">{ pending }</div>
                  </div>
                  <div>
                      <div className="text-sm text-gray-400 mb-1">Referral code</div>
                      <div className="flex items-center gap-2">
                          <div className="md:text-3xl sm:text-xl font-bold font-mono">{refcode}</div>
                          <button className="p-1 hover:bg-white hover:bg-opacity-10 rounded transition-colors" onClick={handleCopyRef}>
                              <Copy size={16} />
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </>
    );
};

export default function Referral() {
  return (
    <SidebarProvider>
        <AuthenticatedLayout>
        <Head title="Referrals" />
            <ProfileView />
        </AuthenticatedLayout>
    </SidebarProvider>
  );
}
