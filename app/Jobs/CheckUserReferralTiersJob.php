<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\ReferralReward;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CheckUserReferralTiersJob implements ShouldQueue
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
        $tiers = [
            ['referralsRequired' => 1, 'bonusPoints' => 0.2],
            ['referralsRequired' => 3, 'bonusPoints' => 0.5],
            ['referralsRequired' => 12, 'bonusPoints' => 1.2],
            ['referralsRequired' => 20, 'bonusPoints' => 2.5],
            ['referralsRequired' => 40, 'bonusPoints' => 5.0],
            ['referralsRequired' => 90, 'bonusPoints' => 10.0],
        ];

        $qualifiedCount = $this->user->referrals()
            ->where('status', 'confirmed')
            ->count();

        $rewardedTiers = ReferralReward::where('user_id', $this->user->id)
            ->pluck('referrals_required')
            ->toArray();

        foreach ($tiers as $tier) {
            if (
                $qualifiedCount >= $tier['referralsRequired'] &&
                !in_array($tier['referralsRequired'], $rewardedTiers)
            ) {
                $this->user->increment('points', $tier['bonusPoints']);

                ReferralReward::create([
                    'user_id' => $this->user->id,
                    'referrals_required' => $tier['referralsRequired'],
                    'bonus_points' => $tier['bonusPoints'],
                ]);
            }
        }
    }
}
