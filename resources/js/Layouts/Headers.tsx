import React, { useEffect, useState } from 'react';
import { Users, Gift, CircleUserRound, Settings, LogOut, ChevronRight, Copy } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/Components/button';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';
import RewardModal from '@/Components/daily-modal';
import VantaBackground from '@/Components/vantabackground'
import { router } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

const Header: React.FC = () => {
    const { toast } = useToast();
    const { collapsed, isMobile, toggleSidebar } = useSidebar();
    const [isClaimed, setIsClaimed] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [avatarUri, setAvatarUri] = useState<string>('');
    const [refcode, setRefCode] = useState('');
    const [referralCount, setReferralCount] = useState(0);
    const [showModal, setShowModal] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [totalPoints, setTotalPoints] = useState<string>('0.00000000');
    const [streakDays, setStreakDays] = useState<string[]>([]);

    function formatWalletAddress(address: string) {
      if (!address) return '';
      const start = address.slice(0, 5);
      const end = address.slice(-5);
      return `${start} ⬩⬩⬩ ${end}`;
    }
    useEffect(() => {
        checkIfClaimedToday();
    }, []);
    const checkIfClaimedToday = async () => {
      try {
          const response = await axios.get('/api/user');
          setTotalPoints(response.data.total_points);
          const today = new Date().toISOString().split('T')[0];

          const streak = response.data.streak_days || [];
          setStreakDays(streak);

          const hasCheckedInToday = streak.includes(today);
          setIsClaimed(hasCheckedInToday);
      } catch (error) {
          console.error('Error fetching user info', error);
      }
  };
  const launchConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 150,
      origin: { y: 0.6 },
    });
  };
  const handleClaim = async () => {
      try {
          const response = await axios.post('/daily-checkin');
          toast({
              title: "",
              description: "Daily reward claimed!",
          });
          setTotalPoints(response.data.total_points);
          setStreakDays(response.data.streak_days);
          setIsClaimed(true);
          launchConfetti();
      } catch (error: any) {
          if (error.response?.status === 409) {
            toast({
              title: "",
              description: "Already checked in today.",
            });
          } else {
            toast({
              title: "",
              description: "Failed to claim reward.",
            });
          }
      }
  };
  
    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const response = await axios.get('/api/me');
            const { referral_code, referral_count, user, streakDays } = response.data;
            setReferralCount(referral_count);
            setRefCode(referral_code);
            setEmailAddress(user.email);
            setWalletAddress(formatWalletAddress(user.wallet_address));
            setStreakDays(streakDays);
          } catch (error) {
            console.error('Error fetching ENS info:', error);
          }
        };

        fetchUserData();
    }, []);
    const handleSignOut = () => {
      router.post('/logout');
    };
  return (

    <header className={cn(
      "fixed top-0 right-0 z-20 flex items-center h-16 bg-black transition-all duration-300",
      isMobile ? "left-0" : collapsed ? "left-[70px]" : "left-[300px]"
    )}>
      {/* CONTAINER INSIDE */}
      <div className="container mx-auto px-6 flex items-center justify-between w-full max-w-full lg:max-w-[1550px]">

        {/* LEFT: Sidebar toggle + Referrals + Streak */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle (mobile only) */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-10 w-10 rounded-full hover:bg-roller-primary/20 focus:bg-roller-primary/20"
            >
              <div className="flex flex-col justify-center items-center w-full h-full">
                <span className={cn(
                  "block h-0.5 w-5 bg-white rounded-full transition-all duration-300",
                  collapsed ? "rotate-0 translate-y-[-3px]" : "rotate-45 translate-y-1"
                )}></span>
                <span className={cn(
                  "block h-0.5 w-5 bg-white rounded-full transition-all duration-300",
                  collapsed ? "opacity-100" : "opacity-0"
                )}></span>
                <span className={cn(
                  "block h-0.5 w-5 bg-white rounded-full transition-all duration-300",
                  collapsed ? "rotate-0 translate-y-[3px]" : "-rotate-45 -translate-y-1"
                )}></span>
              </div>
            </Button>
          )}

          {/* Referrals - hide in mobile */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-zinc-900 px-4 py-2">
            <Users size={18} className="text-gray-400" />
            <span className="text-gray-300">Referrals</span>
            <span className="font-medium">{referralCount}</span>
            <button className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm hover:bg-opacity-70 transition-colors border border-zinc-500">
              Copy Code
            </button>
          </div>

          {/* Day Streak - always visible, fixed width */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-zinc-900 px-4 py-2 min-w-[160px] justify-between">
            <div className="flex items-center gap-2">
              <Gift size={18} className="text-gray-400" />
              <span className="text-gray-300">Streak</span>
              <span className="font-medium">{streakDays}</span>
            </div>
            <button className={`bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm hover:bg-opacity-70 transition-colors border border-zinc-500 ${
                    isClaimed ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-70'
                }`}
                onClick={() => {
                  if (!isClaimed) setIsModalOpen(true);
                }}
                disabled={isClaimed}
                >
              { isClaimed ? 'Claimed' : 'Check In' }
            </button>
            <RewardModal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onClaim={() => {
                    handleClaim();
                }}
            />

          </div>
        </div>
                {/* 0x30bca2406e601b4cde45d3cbe8e17f16c73702df */}
        {/* RIGHT: Wallet Address */}
        {/* <div className="bg-[rgba(255,255,255,0.1)] rounded-full px-4 py-2 font-mono text-sm">
          {walletAddress}
        </div> */}
        <div className="flex items-center gap-x-5 md:gap-x-10">
          <div className="flex items-center justify-end">
              <div className="relative flex items-center ">
                  <div className="group">
                      <div className="space-font flex cursor-pointer items-center justify-center gap-x-[7px] bg-black bg-opacity-50 rounded-full text-sm hover:bg-opacity-70 transition-colors border border-zinc-500 px-3 py-2 hover:bg-[#3E3E3E] md:px-[23px]">{walletAddress || emailAddress}</div>
                      <div className="shadow-md invisible absolute right-0 sm:right-[10px] top-[36px] z-[9998] w-[300px] pt-[18px] opacity-0 transition-opacity duration-300 group-hover:visible group-hover:opacity-100">
                          <div className="w-full rounded-xl bg-white text-sm font-bold leading-5 text-white shadow-[0px_4px_20px_0px_#00000014] relative">
                              <div className="rounded-t-xl bg-neutral-900 pt-10 relative z-0">
                                <VantaBackground />
                                  <div className="pb-[33px] relative z-10">
                                      <div className="relative mb-5 flex justify-center shine-text">
                                          <img alt="avatar" className="h-[86px] w-[86px] rounded-full " src="/assets/images/avatar.jpg" />
                                      </div>
                                      {/* <h2 className="text-center text-base font-extrabold text-gray-300 shine-text">{currentTierLevelName}</h2> */}
                                      <div className="space-font mt-[17px] flex items-center justify-center gap-1.5">
                                          <span className="text-sm text-white shine-text">{walletAddress || emailAddress}</span>
                                          <div className="relative">
                                              <Copy className="ml-1 h-3 w-3 md:h-4 md:w-4 cursor-pointer text-gray-500" />
                                          </div>
                                      </div>
                                  </div>
                              </div>
                              <div className="hover-group mx-6 flex cursor-pointer items-center justify-between rounded-lg px-4 pb-[11px] pt-[30px] text-[#595A5F] hover:border-[#000000]">
                                  <div className="flex items-center gap-2">
                                      <CircleUserRound className="h-[18px] w-[18px]" />
                                      <span className="text-sm font-medium text-[#595A5F]">Profile</span>
                                  </div>
                                  <div>
                                      <ChevronRight className="h-auto w-[15px] text-gray-500" />
                                  </div>
                              </div>
                              <div className="hover-group mx-6 flex cursor-pointer items-center justify-between rounded-lg px-4 pb-[30px] pt-[11px] text-[#595A5F] hover:border-[#000000]">
                                  <div className="flex items-center gap-2">
                                      <Settings className="h-[18px] w-[18px]" />
                                      <span className="text-sm font-medium text-[#595A5F]">Settings</span>
                                  </div>
                                  <div>
                                      <ChevronRight className="h-auto w-[15px] text-gray-500" />
                                  </div>
                              </div>
                              <div className="mx-6 flex cursor-pointer items-center justify-start rounded-b-lg border-t border-[#EAEAEA] px-4 pb-[21px] pt-[17px]">
                                  <LogOut className="mr-2 h-[18px] w-[18px] text-gray-700" />
                                  <span className="hover-span text-[14px] font-normal text-[#595A5F]" onClick={handleSignOut}>Sign out</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      </div>
    </header>
  );
};

export default Header;
