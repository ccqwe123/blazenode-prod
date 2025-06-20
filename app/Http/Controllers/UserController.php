<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function rewardStatus()
    {
        $user = auth()->user();
        $time_left = $user->last_claimed_at ? Carbon::now()->diffInMinutes($user->last_claimed_at) : 0;
        return response()->json([
            'claimed' => $user->last_claimed_at ? true : false,
            'time_left' => $time_left,
        ]);
    }

    public function claimReward(Request $request)
    {
        $user = User::find($request->user()->id);
        $user->last_claimed_at = Carbon::now();
        $user->save();
        return response()->json([
            'success' => true,
        ]);
    }
}
