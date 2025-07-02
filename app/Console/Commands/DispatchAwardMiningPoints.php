<?php

namespace App\Console\Commands;

use App\Jobs\AwardMiningPoints;
use App\Models\User;
use Illuminate\Console\Command;

class DispatchAwardMiningPoints extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'award:points';
    // protected $signature = 'app:dispatch-award-mining-points';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dispatch jobs to award mining points for all users';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // User::with('miners')->chunk(500, function ($users) {
        //     foreach ($users as $user) {
        //         dispatch((new AwardMiningPoints($user))->delay(now()->addSeconds(5)));
        //     }
        // });
        User::whereHas('miners', function ($query) {
            $query->where('is_active', 1)
                ->whereNotNull('mining_started_at')
                ->whereNotNull('mining_ends_at')
                ->where('mining_ends_at', '>=', now());
        })
        ->with(['miners' => function ($query) {
            $query->where('is_active', 1)
                ->whereNotNull('mining_started_at')
                ->whereNotNull('mining_ends_at')
                ->where('mining_ends_at', '>=', now());
        }])
        ->chunk(500, function ($users) {
            foreach ($users as $user) {
                dispatch((new AwardMiningPoints($user))->delay(now()->addSeconds(5)));
            }
        });
        $this->info('AwardMiningPoints jobs dispatched for all users.');
    }
}
