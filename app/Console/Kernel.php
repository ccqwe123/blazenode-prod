<?php

namespace App\Console;

use App\Jobs\UpdateAllActiveMinersPoints;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->job(new UpdateAllActiveMinersPoints)->everyThreeMinutes()->onOneServer();
        $schedule->command('award:points')->everyFiveMinutes();
        $schedule->command('referrals:dispatch-check-jobs')->everyFiveMinutes();
        $schedule->command('referrals:check-rewards')->everyFiveMinutes();
        // $schedule->command('referrals:dispatch-check-jobs')->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
