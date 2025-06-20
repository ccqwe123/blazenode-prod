import React, { useState, useEffect } from 'react';

interface TierData {
  level: string;
  referralsRequired: number;
  imageUrl: string;
  bonusPoints?: number;
}

interface TierProps {
  tier: TierData;
  isActive: boolean;
  isNext: boolean;
  currentReferrals: number;
}

interface ProgressBarProps {
  progress: number;
}

interface TierProgressProps {
  currentReferrals?: number;
  className?: string;
  onTierChange?: (tierLevel: string, bonusPoints: number) => void;
}

const getTierData = (): TierData[] => [
    { level: 'Fire Starter', referralsRequired: 1 , imageUrl: "/assets/images/tiers/tier0.png", bonusPoints: 0.2 },
    { level: 'Glow Core', referralsRequired: 3, imageUrl: "/assets/images/tiers/tier1.png", bonusPoints: 0.5 },
    { level: 'Torch Blaze', referralsRequired: 12, imageUrl: "/assets/images/tiers/tier2.png", bonusPoints: 1.2 },
    { level: 'Spark Vibe', referralsRequired: 20, imageUrl: "/assets/images/tiers/tier3.png", bonusPoints: 2.5 },
    { level: 'Flame Peak', referralsRequired: 40, imageUrl: "/assets/images/tiers/tier4.png", bonusPoints: 5.0 },
    { level: 'Blaze Master', referralsRequired: 90, imageUrl: "/assets/images/tiers/tier5.png", bonusPoints: 10.0 },
];

const calculateProgress = (
  currentReferrals: number,
  currentThreshold: number,
  nextThreshold: number
): number => {
  const tiers = [
    { min: 0, max: 1, startProgress: 0, endProgress: 1 },
    { min: 1, max: 3, startProgress: 1, endProgress: 20 },
    { min: 3, max: 12, startProgress: 20, endProgress: 40 },
    { min: 12, max: 20, startProgress: 40, endProgress: 60 },
    { min: 20, max: 40, startProgress: 60, endProgress: 80 },
    { min: 40, max: 90, startProgress: 80, endProgress: 100 }
  ];

  const currentTier = tiers.find(t =>
    currentReferrals >= t.min && currentReferrals <= t.max
  );

  if (!currentTier) return currentReferrals >= 90 ? 100 : 0;

  const tierProgress = (currentReferrals - currentTier.min) / (currentTier.max - currentTier.min);
  const progressRange = currentTier.endProgress - currentTier.startProgress;

  return currentTier.startProgress + tierProgress * progressRange;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => (
  <div className="absolute top-[43%] left-[20px] w-[calc(100%-6rem)] mx-4 transform -translate-y-1/2 z-0 opacity-30">
    <div className="h-2 md:h-3 bg-gray-700 rounded-full w-full"></div>
    <div
      className="h-2 md:h-3 bg-red-500/30 blur-sm rounded-full absolute top-0 left-0 transition-all duration-1000 ease-out"
      style={{ width: `${progress}%` }}
    ></div>
    <div
      className="h-2 md:h-3 rounded-full absolute top-0 left-0 transition-all duration-1000 ease-out animate-pulse"
      style={{
        width: `${progress}%`,
        background: 'linear-gradient(90deg, rgb(248, 113, 113) 0%, rgb(255, 255, 255) 100%)'
      }}
    ></div>
  </div>
);

const Tier: React.FC<TierProps> = ({ tier, isActive, isNext, currentReferrals }) => {
  const isFirstTierInactive = tier.referralsRequired === 1 && currentReferrals === 0;

  return (
    <div className="flex flex-col items-center px-1 sm:px-2">
      <div className="text-[10px] sm:text-xs font-medium mb-0 text-center h-8 flex items-center">
        <span className={`${isActive && !isFirstTierInactive ? 'text-yellow-500' : 'text-gray-500'} text-center leading-tight`}>
          {tier.level}
        </span>
      </div>

      <div className={`
        relative md:w-[6rem] md:h-[6rem] mb-1 sm:mb-2
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        ${isActive && !isFirstTierInactive ? 'scale-110' : 'opacity-50'}
        ${isNext ? 'opacity-70 hover:opacity-90' : ''}
      `}>
        <div className={`absolute inset-0 rounded-full overflow-hidden ${isActive && !isFirstTierInactive ? 'shadow-glow' : ''}`}>
          <img
            src={tier.imageUrl}
            alt={`Tier ${tier.level}`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="text-center">
        <div className={`text-sm sm:text-base md:text-lg font-bold ${isActive && !isFirstTierInactive ? 'text-white' : 'text-gray-500'}`}>
          {tier.referralsRequired}
        </div>
        <div className={`text-[10px] sm:text-xs ${isActive && !isFirstTierInactive ? 'text-gray-300' : 'text-gray-500'}`}>
          Referrals
        </div>
      </div>
    </div>
  );
};

const ReferralTier: React.FC<TierProgressProps> = ({
  currentReferrals = 0,
  className = '',
  onTierChange
}) => {
  const [progress, setProgress] = useState(0);
  const tiers = getTierData();

  const currentTierIndex = tiers.findIndex((tier, index) => {
    const next = tiers[index + 1];
    return next && currentReferrals < next.referralsRequired;
  });

  const finalIndex = currentReferrals >= tiers[tiers.length - 1].referralsRequired
    ? tiers.length - 1
    : currentTierIndex;

  const currentTier = tiers[finalIndex];
  console.log("currentTier");
  console.log(currentTier);
  const nextTier = tiers[finalIndex + 1];
  const currentBonusPoints = Number(currentTier?.bonusPoints ?? 0);

  useEffect(() => {
    setProgress(
      nextTier
        ? calculateProgress(currentReferrals, currentTier.referralsRequired, nextTier.referralsRequired)
        : 100
    );

    if (onTierChange) {
      onTierChange(currentTier.level, currentBonusPoints);
    }
  }, [currentReferrals, currentTier, nextTier, onTierChange]);

  const referralsToNextTier = nextTier
    ? Math.max(0, nextTier.referralsRequired - currentReferrals)
    : 0;

  return (
    <div className={`bg-transparent rounded-lg p-2 sm:p-4 md:p-6 lg:p-8 shadow-xl text-white ${className}`}>
      <div className="relative min-h-[120px] sm:min-h-[150px] md:min-h-[180px] lg:min-h-[200px]">
        <ProgressBar progress={progress} />
        <div className="flex justify-between relative z-10 mt-4">
          {tiers.map((tier, index) => (
            <Tier
              key={tier.level}
              tier={tier}
              isActive={index <= finalIndex}
              isNext={index === finalIndex + 1}
              currentReferrals={currentReferrals}
            />
          ))}
        </div>
      </div>

      {nextTier && (
        <div className="text-center mt-4 sm:mt-6 text-sm sm:text-base text-gray-400">
          Next Tier: <span className="text-white font-semibold">{referralsToNextTier}</span>
        </div>
      )}
    </div>
  );
};

export default ReferralTier;
