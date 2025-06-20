<?php

namespace App\Console\Commands;

use App\Models\Referral;
use Illuminate\Console\Command;
use App\Jobs\CheckReferralMiningHoursJob;

class CheckReferralMiningHours extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'referrals:dispatch-check-jobs';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check referred users if they reached 72 hours of mining time';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Dispatching referral check jobs...');

        Referral::where('status', 'pending')
            ->chunkById(500, function ($referrals) {
                foreach ($referrals as $referral) {
                    CheckReferralMiningHoursJob::dispatch($referral);
                }
            });

        $this->info('All referral jobs dispatched.');
    }
}
