<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Jobs\CheckUserReferralTiersJob;

class CheckReferralRewards extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'referrals:check-rewards';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check and reward users who reached referral milestones';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        User::whereHas('referrals', function ($query) {
            $query->where('status', 'confirmed');
        })
        ->chunk(500, function ($users) {
            foreach ($users as $user) {
                CheckUserReferralTiersJob::dispatch($user);
            }
        });

        $this->info('Dispatched referral reward jobs in chunks.');
    }
}
