<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\DailyCheckIn;

class CheckInController extends Controller
{
    public function claim(Request $request)
    {
        $user = Auth::user();
        $today = Carbon::today();

        $alreadyCheckedIn = DailyCheckIn::where('user_id', $user->id)
            ->whereDate('check_in_date', $today)
            ->exists();

        if ($alreadyCheckedIn) {
            return response()->json(['message' => 'Already checked in today'], 409);
        }

        DB::transaction(function () use ($user, $today) {
            DailyCheckIn::create([
                'user_id' => $user->id,
                'check_in_date' => $today,
            ]);

            $user->total_points = bcadd($user->total_points, '0.00100000', 8);
            $user->save();
        });

        $streak = DailyCheckIn::where('user_id', $user->id)
            ->orderByDesc('check_in_date')
            ->count();

        return response()->json([
            'message' => 'Check-in successful',
            'total_points' => $user->total_points,
            'streak_days' => $streak,
        ]);
    }
}
