<?php

namespace App\Http\Controllers;
use App\Events\MinerStatusUpdated;
use Illuminate\Http\Request;
use App\Models\Miner;
use App\Models\MiningSession;
use App\Models\Point;
use App\Models\Referral;
use App\Models\ReferralCommission;
use App\Models\User;
use App\Models\DailyCheckIn;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class MinerController extends Controller
{
    public function start(Request $request, Miner $miner)
    {
        try {
            $user = auth()->user();
        $miners = $user->miners;

        $runningMiner = $miners->first(function ($miner) {
            return $miner->mining_ends_at && now()->lt($miner->mining_ends_at);
        });

        if ($runningMiner) {
            return response()->json(['error' => 'One or more miners are still running'], 422);
        }

        $duration = 6 * 60 * 60;
        // $duration = 10;
        foreach ($user->miners as $miner) {
            // Check if miner is already running
            if ($miner->mining_ends_at && now()->lt($miner->mining_ends_at)) {
                continue; // Skip this miner, it's still running
            }

            $miner->update([
                'mining_started_at' => now(),
                'mining_ends_at' => now()->addSeconds($duration),
                'is_mining' => true,
            ]);

            broadcast(new MinerStatusUpdated($miner))->toOthers();
        }
        $userTotalSecondsMined = MiningSession::where('user_id', $user->id)->sum(DB::raw('TIMESTAMPDIFF(SECOND, started_at, stopped_at)'));
        info("User total seconds mined: $userTotalSecondsMined");
        if ($userTotalSecondsMined < 72 * 60 * 60) { // 259200 seconds
            $activeSession = MiningSession::where('user_id', $user->id)
            ->whereNull('stopped_at')
            ->where('user_id', $user->id)
            ->latest()
            ->first();

            if (!$activeSession) {
                MiningSession::create([
                    'user_id' => $user->id,
                    'started_at' => now(),
                    'stopped_at' => now()->addHours(6),
                ]);
                // info("Created new session");
            }
        }


        // broadcast(new MinerStatusUpdated($miner))->toOthers();

        return response()->json([
            'message' => 'Miner started',
            'miner' => [
                'id' => $miner->id,
                'is_mining' => $miner->is_mining,
                'mining_ends_at' => $miner->mining_ends_at->toDateTimeString(),
            ],
        ]);
        } catch (\Throwable $th) {
            //throw $th;
            info($th->getMessage());
        }
    }

    public function userMiners(Request $request)
    {
        $user = $request->user();
        $miners = $user->miners()->where('is_active', 1)->get();
        $aggregates = DB::table('miners')
                    ->selectRaw('COUNT(*) as miner_count, SUM(mining_speed) as total_power')
                    ->where('user_id', $user->id)
                    ->where('is_active', 1)
                    ->first();

        $totalPoints = DB::table('points')
                        ->where('user_id', $user->id)
                        ->sum('points');
        return response()->json([
            'miners' => $miners,
            'miner_count' => $aggregates->miner_count,
            'totalPoints' => $totalPoints,
            'totalPower' => $aggregates->total_power,
        ]);
    }

    public function points(Request $request)
    {
        $user = User::with('miners')->find(auth()->id());
        $user->load('miners');
        $totalAllTime = Point::where('user_id', $user->id)->sum('points');
        $totalToday = Point::where('user_id', $user->id)
            ->whereDate('created_at', now()->toDateString())
            ->sum('points');
        $totalHashPower = Miner::where('is_active', 1)->where('user_id', $user->id)->sum('mining_speed');
        // $defaultMultiplier = 0.003093;
        // $now = now();
        // $today = $now->toDateString();
        // $totalPointsEarned = 0;
        // foreach ($user->miners as $miner) {
        //     if (!$miner->mining_started_at || !$miner->mining_ends_at || !$miner->is_active) {
        //         continue;
        //     }

        //     $startedAt = $miner->mining_started_at;
        //     $endsAt = $miner->mining_ends_at;

        //     $intervalSeconds = 180;
        //     $elapsedSeconds = $now->diffInSeconds($startedAt);
        //     $maxElapsed = $startedAt->diffInSeconds($endsAt);
        //     $actualElapsed = min($elapsedSeconds, $maxElapsed);

        //     $totalIntervals = floor($actualElapsed / $intervalSeconds);

        //     $pointsPerInterval = (float) $miner->mining_speed * $defaultMultiplier;
        //     $totalEarnedPoints = $totalIntervals * $pointsPerInterval;

        //     $miner->earned_points = round($totalEarnedPoints, 8);
        //     $miner->save();

        //     $point = Point::where('user_id', $user->id)
        //         ->where('miner_id', $miner->id)
        //         ->where('date', $today)
        //         ->first();

        //     if ($point) {
        //         $point->points = round($totalEarnedPoints, 8);
        //         $point->save();
        //     } else {
        //         Point::create([
        //             'user_id' => $user->id,
        //             'miner_id' => $miner->id,
        //             'points' => round($totalEarnedPoints, 8),
        //             'date' => $today,
        //         ]);
        //     }
        //     $totalPointsEarned += round($totalEarnedPoints , 8);
        //     if ($user->referred_by) {
        //         $commissionRate = 0.01; // 1% commission
        //         $commission = $totalEarnedPoints * $commissionRate;

        //         $com = ReferralCommission::where('referrer_by', $user->referred_by)
        //             ->where('referred_user_id', $user->id)
        //             ->where('miner_id', $miner->id)
        //             ->where('date', $today)
        //             ->first();
        //         if($com){
        //             $com->commission += $commission;
        //             $com->save();
        //         }else{
        //             ReferralCommission::create([
        //                 'referrer_by' => $user->referred_by,
        //                 'referred_user_id' => $user->id,
        //                 'miner_id' => $miner->id,
        //                 'commission' => $commission,
        //                 'date' => $today,
        //             ]);
        //         }

        //         User::find($user->referred_by)->increment('total_points', $commission);
        //     }
        // }
        // $user->total_points += $totalPointsEarned;
        // $user->save();
        return response()->json([
            'totalHashPower' => $totalHashPower,
            // 'total_atotalHashPowerll_time' => $totalHashPower,
            'total_points' => $totalAllTime,
            'total_points_today' => $totalToday,
        ]);
    }

    public function pointsDaily()
    {
        $userId = Auth::id();

        $dailyPoints = Point::select(
                DB::raw('DATE(date) as date'),
                DB::raw('SUM(points) as points')
            )
            ->where('user_id', $userId)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        $streak = DailyCheckIn::where('user_id', $userId)
            ->orderByDesc('check_in_date')
            ->count();

        // Fetch daily referral earnings data
        $referralEarnings = ReferralCommission::select(
                DB::raw('DATE(date) as date'),
                DB::raw('SUM(commission) as referralEarnings')
            )
            ->where('referrer_by', $userId)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Merge the two collections based on 'date'
        $mergedData = [
            // 'streak_days' => $streak,
        ];

        // Convert the dailyPoints collection to an associative array with date as key
        foreach ($dailyPoints as $point) {
            $mergedData[$point->date] = [
                'date' => $point->date,
                'points' => $point->points,
                'referralEarnings' => 0 // Initialize with 0 referralEarnings
            ];
        }

        // Add referralEarnings data to the mergedData array
        foreach ($referralEarnings as $referral) {
            if (isset($mergedData[$referral->date])) {
                $mergedData[$referral->date]['referralEarnings'] = $referral->referralEarnings;
            } else {
                // If there's no entry for this date in points, create a new entry with referral earnings
                $mergedData[$referral->date] = [
                    'date' => $referral->date,
                    'points' => 0, // No points for this day
                    'referralEarningsrefe' => $referral->referralEarnings
                ];
            }
        }

        return response()->json(array_values($mergedData));
    }

    public function upgrade(Request $request) //step 1
    {
        $minerId = $request->input('node_id');
        $user = User::with('miners')->find(auth()->id());
        $miner = $user->miners->where('node_id', $minerId)->first();
        if (!$miner) {
            return response()->json([
                'status' => false,
                'message' => 'Node not found',
            ], 404);
        }
        $upgradeCosts = [
            1 => 0.0000000,
            2 => 10.5000000,
            3 => 15.5500000,
            4 => 20.0000000,
        ];
        $currentLevel = $miner->level;
        if (!isset($upgradeCosts[$currentLevel])) {
            return response()->json([
                'status' => false,
                'message' => 'No upgrade available for current level',
            ], 400);
        }
        $upgradeCost = $upgradeCosts[$currentLevel];

        if ($user->total_points < $upgradeCost) {
            return response()->json([
                'status' => false,
                'message' => 'Insufficient balance',
            ], 400);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Balance verified',
        ]);
    }

    public function upgradeNode(Request $request) // step 2
    {
        $minerId = $request->input('node_id');
        $user = User::with('miners')->find(auth()->id());
        $miner = $user->miners->where('node_id', $minerId)->first();
        if (!$miner) {
            return response()->json([
                'status' => false,
                'message' => 'Node not found',
            ], 404);
        }
        $upgradeCosts = [
            1 => 0.0000000,
            2 => 10.5000000,
            3 => 15.5500000,
            4 => 20.0000000,
        ];
        $miningSpeeds = [
            1 => 1.0,
            2 => 1.3,
            3 => 1.8,
            4 => 2.3,
            5 => 3.0,
        ];
        $currentLevel = $miner->level;
        if (!isset($upgradeCosts[$currentLevel])) {
            return response()->json([
                'status' => false,
                'message' => 'No upgrade available for current level',
            ], 400);
        }
        $upgradeCost = $upgradeCosts[$currentLevel];

        if ($user->total_points < $upgradeCost) {
            return response()->json([
                'status' => false,
                'message' => 'Insufficient balance',
            ], 400);
        }

        $user->total_points -= $upgradeCost;
        $user->save();

        $newLevel = $currentLevel + 1;
        $newSpeed = $miningSpeeds[$newLevel] ?? $miner->mining_speed;
        $miner->level = $newLevel;
        $miner->mining_speed = $newSpeed;
        $miner->save();

        return response()->json([
            'status' => true,
            'message' => "Node upgraded to level $newLevel.",
        ]);
    }

    public function me(Request $request)
    {
        // $user = $request->user();
        $user = auth()->user();
        if ($user) {
            $referredUsers = $user->referredUsers()->with(['referralCommissions' => function ($query) use ($user) {
                $query->where('referrer_by', $user->id);
            }])->get();
        }else{
            return response()->json(['error' => 'User  not authenticated'], 401);
        }

        $streak = DailyCheckIn::where('user_id', $user->id)
            ->orderByDesc('check_in_date')
            ->count();

        $totalPointsEarned = $referredUsers->flatMap(function ($referred) {
            return $referred->referralCommissions;
        })->sum('commission');

        $pending = Referral::where('referrer_id', $user->id)->where('status', 'pending')->count();
        $qualified = Referral::where('referrer_id', $user->id)->where('status', 'confirmed')->count();
        return response()->json([
            'streakDays' => $streak,
            'user' => $user,
            'confirmed' => $qualified,
            'pending' => $pending,
            'referral_code' => $user->referral_code,
            'referral_count' => $referredUsers->count(),
            'total_points_earned' => $totalPointsEarned,
            'referred_users' => $referredUsers->map(function ($referred) {
                return [
                    'id' => $referred->id,
                    'name' => $referred->username,
                    'email' => $referred->email,
                    'joined_at' => $referred->created_at->toDateString(),
                    'points_earned' => $referred->referralCommissions->sum('commission') ?? 0,
                ];
            }),
        ]);
    }


    // public function getUserPoints(Miner $miner)
    // {
    //     $user = auth()->user();

    //     if (!$user) {
    //         return response()->json(['message' => 'User not authenticated'], 401);
    //     }

    //     // Ensure the user is an Eloquent model instance
    //     if (!($user instanceof \App\Models\User)) {
    //         return response()->json(['message' => 'Invalid user model'], 400);
    //     }

    //     $totalPoints = $miner->total_points;
    //     $elapsedTime = now()->diffInSeconds($miner->mining_started_at);

    //     $pointsPerInterval = $totalPoints / (6 * 60 * 60 / 180);
    //     $elapsedIntervals = $elapsedTime / 180;
    //     $earnedPoints = $pointsPerInterval * $elapsedIntervals;
    //     $user->points += $earnedPoints;
    //     $user->save();
    //     $miner->load('user');

    //     if (!($miner->user instanceof \App\Models\User)) {
    //         return response()->json(['message' => 'Invalid miner user model'], 400);
    //     }

    //     $miner->user->points += $earnedPoints;
    //     $miner->user->save();

    //     // Return the response with the total points earned and the miner's points
    //     return response()->json([
    //         'total_points' => $earnedPoints,
    //         'miner_points' => $miner->user->points,
    //     ]);
    // }

}
