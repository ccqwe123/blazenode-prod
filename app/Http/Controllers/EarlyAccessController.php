<?php

namespace App\Http\Controllers;

use App\Models\EarlyAccess;
use App\Models\Referral;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class EarlyAccessController extends Controller
{
    public function store(Request $request)
    {
        $wallet = $request->input('walletAddress');
        $earlyAccess = EarlyAccess::where('wallet_address', $wallet)->firstOrFail();
        $total_tasks = 6;

        return response()->json([
            'id' => $earlyAccess->id,
            'walletAddress' => $earlyAccess->wallet_address,
            'followed' => (bool) $earlyAccess->followed,
            'liked' => (bool) $earlyAccess->liked,
            'retweeted' => (bool) $earlyAccess->retweeted,
            'discord' => (bool) $earlyAccess->discord,
            'telegram' => (bool) $earlyAccess->telegram,
            'googleConnected' => (bool) $earlyAccess->google,
            'twitterConnected' => (bool) $earlyAccess->twitterConnected,
            'completedAt' => $earlyAccess->completed_at,
            'createdAt' => $earlyAccess->created_at,
            'updatedAt' => $earlyAccess->updated_at,
            'total_tasks' => $total_tasks,
        ]);
    }

    public function show(Request $request, $action)
    {
        $wallet = $request->input('walletAddress');
        if (!$wallet) {
            return response()->json([
                'status' => false,
                'message' => 'Wallet is required',
            ], 400);
        }

        $validActions = ['liked', 'retweeted', 'followed', 'discord', 'telegram', 'twitterConnected'];

        if (!in_array($action, $validActions)) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid action',
            ], 400);
        }

        $earlyAccess = EarlyAccess::updateOrCreate(
            ['wallet_address' => $wallet],
            [$action => true]
        );

        return response()->json([
            'id' => $earlyAccess->id,
            'walletAddress' => $earlyAccess->wallet_address,
            'twitterConnected' => (bool) $earlyAccess->twitterConnected,
            'followed' => (bool) $earlyAccess->followed,
            'liked' => (bool) $earlyAccess->liked,
            'retweeted' => (bool) $earlyAccess->retweeted,
            'discord' => (bool) $earlyAccess->discord,
            'telegram' => (bool) $earlyAccess->telegram,
            'googleConnected' => (bool) $earlyAccess->google,
            'completedAt' => $earlyAccess->completed_at,
            'createdAt' => $earlyAccess->created_at,
            'updatedAt' => $earlyAccess->updated_at,
        ]);
    }

    public function waitlist(Request $request)
    {
        $wallet = $request->input('walletAddress');
        $earlyAccess = EarlyAccess::where('wallet_address', $wallet)->firstOrFail();
        if($earlyAccess){
            $earlyAccess->completed_at = now();
            $earlyAccess->save();
        }
        return response()->json([
            'id' => $earlyAccess->id,
            'walletAddress' => $earlyAccess->wallet_address,
            'followed' => (bool) $earlyAccess->followed,
            'liked' => (bool) $earlyAccess->liked,
            'retweeted' => (bool) $earlyAccess->retweeted,
            'discord' => (bool) $earlyAccess->discord,
            'telegram' => (bool) $earlyAccess->telegram,
            'googleConnected' => (bool) $earlyAccess->google,
            'completedAt' => $earlyAccess->completed_at,
            'createdAt' => $earlyAccess->created_at,
            'updatedAt' => $earlyAccess->updated_at,
        ]);
    }

    public function createUser(Request $request)
    {
        $referrerId = null;
        $referrer = User::where('referral_code', $request->referral_code)->first();
        if ($request->filled('referral_code')) {
            if ($referrer) {
                $referrerId = $referrer->id;
            }
        }
        $ipAddress = $request->ip();
        $password = Str::random(10);
        $user = User::where('wallet_address', $request->wallet_address)->first();
        if (!$user) {
            $user = User::create([
                'wallet_address' => $request->wallet_address,
                'password' => Hash::make($password),
                'referral_code' => $this->generateUniqueReferralCode(),
                'ip_address' => $ipAddress,
                'referred_by' => $referrerId,
                'role' => 'user',
            ]);

            $existingReferral = User::where('ip_address', $ipAddress)
                ->whereHas('referredBy')
                ->exists();
            if ($referrer && !$existingReferral) {
                Referral::create([
                    'referrer_id' => $referrer->id,
                    'referred_user_id' => $user->id,
                    'status' => 'pending',
                ]);
            }
        }
        return response()->json([
            'status' => true,
            'referral_code' => $user->referral_code,
            'referralCount' => $user->referrals()->count(),
        ], 201);
    }

    function generateUniqueReferralCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (User::where('referral_code', $code)->exists());

        return $code;
    }

    public function leaderboard(Request $request)
    {
        $users = User::withCount('referrals')
        ->join('early_accesses','users.wallet_address','=','early_accesses.wallet_address')
        ->orderBy('users.created_at')
        ->whereNotNull('early_accesses.completed_at')
        ->take(100)
        ->get()
        ->map(function ($user) {
            return [
                'wallet_address' => $user->wallet_address,
                'referral_count' => $user->referrals_count ?? 0,
                'joined_at' => Carbon::parse($user->created_at)->format('F d, Y'),
            ];
        });
        
        return response()->json($users);
    }

    public function counter()
    {
        $a = EarlyAccess::count();
        $b = EarlyAccess::whereNotNull('completed_at')->count();
        $c = ['total user'=>$a, 'total completed task'=>$b];
        return $c;
    }
}
