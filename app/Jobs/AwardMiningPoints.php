<?php

namespace App\Jobs;

use App\Models\Miner;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Carbon;
use App\Models\User;
use App\Models\Point;
use App\Models\ReferralCommission;
use Illuminate\Support\Facades\DB;

class AwardMiningPoints implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $user;
    /**
     * Create a new job instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $now = now();
        $today = $now->toDateString();
        $miners = $this->user->miners()->where('is_active', 1)
            ->whereNotNull('mining_started_at')
            ->whereNotNull('mining_ends_at')
            ->where('mining_ends_at', '>=', $now)
            ->get();
            foreach ($miners as $miner) {
                if ($miner->mining_ends_at->lt($now)) {
                    continue;
                }

                $pointsPerFiveMinutes = $this->calculatePointsForMiner($miner);
                $pointsToAward = $pointsPerFiveMinutes;

                $miner->earned_points = round($miner->earned_points + $pointsToAward, 8);
                $miner->save();

                $referral = $this->user->referredBy()->where('status', 'confirmed')->first();

                if ($referral && $this->user->referrer) {
                    $referralCommission = $this->calculateReferralCommission($pointsToAward);
                    $this->updateReferralCommission($this->user, $miner, $referralCommission);
                    $referral->referrer->increment('total_points', $referralCommission);
                }

                $existingPoint = Point::where('user_id', $this->user->id)
                    ->where('miner_id', $miner->id)
                    ->where('date', $today)
                    ->first();

                if (!$existingPoint) {
                    Point::create([
                        'user_id' => $this->user->id,
                        'miner_id' => $miner->id,
                        'points' => $pointsToAward,
                        'date' => $today,
                    ]);
                } else {
                    $existingPoint->increment('points', $pointsToAward);
                }

                $this->user->increment('total_points', $pointsToAward);
            }
    }
    private function calculatePointsForMiner(Miner $miner)
    {
        $defaultMultiplier = 0.003000;
        return (float) $miner->mining_speed * $defaultMultiplier / 12;
    }

    private function calculateReferralCommission($points)
    {
        $commissionPercentage = 0.01;
        return $points * $commissionPercentage;
    }

    private function updateReferralCommission(User $user, Miner $miner, $commission)
    {
        $referralCommission = ReferralCommission::where('referrer_by', $user->referrer->id)
            ->where('referred_user_id', $user->id)
            ->where('miner_id', $miner->id)
            ->where('date', now()->toDateString())
            ->first();
        info("updateReferralCommission");
        if ($referralCommission) {
            $referralCommission->increment('commission', $commission);
        } else {
            ReferralCommission::create([
                'referrer_by' => $user->referrer->id,
                'referred_user_id' => $user->id,
                'miner_id' => $miner->id,
                'commission' => $commission,
                'date' => now()->toDateString(),
            ]);
        }
    }
}
