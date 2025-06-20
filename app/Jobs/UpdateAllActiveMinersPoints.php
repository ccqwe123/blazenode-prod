<?php

namespace App\Jobs;

use App\Models\Miner;
use App\Models\Point;
use Illuminate\Support\Facades\DB;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateAllActiveMinersPoints implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    public function handle()
    {
        $today = now()->toDateString();

        Miner::with('user')
            ->where('is_active', 1)
            ->where('mining_ends_at', '>', now())
            ->chunk(1000, function ($miners) use ($today) {
                foreach ($miners as $miner) {
                    $speed = $miner->mining_speed;

                    Point::updateOrCreate(
                        [
                            'user_id' => $miner->user_id,
                            'miner_id' => $miner->id,
                            'date' => $today,
                        ],
                        [
                            'points' => DB::raw("points + {$speed}")
                        ]
                    );

                    $miner->user->increment('points', $speed);
                }
            });
    }
}
