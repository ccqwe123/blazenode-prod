<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use App\Models\MiningSession;
use App\Models\Referral;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CheckReferralMiningHoursJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;
    public $referral;
    /**
     * Create a new job instance.
     */
    public function __construct(Referral $referral)
    {
        $this->referral = $referral;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $totalSeconds = MiningSession::where('user_id', $this->referral->referred_user_id)
            ->whereNotNull('stopped_at')
            ->selectRaw('SUM(TIMESTAMPDIFF(SECOND, started_at, stopped_at)) as total_seconds')
            ->value('total_seconds') ?? 0;
        // info("CheckReferralMiningHoursJob");
        // info("Total seconds: $totalSeconds");
        // info("user_id: $this->referral->referred_user_id");
        if ($totalSeconds >= 259200) {
            $this->referral->update([
                'status' => 'confirmed',
                'qualified_at' => now(),
            ]);
            // info("Referral qualified");
        }
    }
}
