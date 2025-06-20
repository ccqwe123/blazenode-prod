<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Miner;
use App\Models\Referral;
use App\Models\User;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'min:6'],
            'confirmPassword' => ['required', 'same:password'],
            'referral_code' => ['nullable', 'string', 'size:6', 'exists:users,referral_code'],
            'agreeToTerms' => ['accepted'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $referrerId = null;
        $referrer = User::where('referral_code', $request->referral_code)->first();
        if ($request->filled('referral_code')) {
            if ($referrer) {
                $referrerId = $referrer->id;
            }
        }
        $email = $request->email;
        $name = explode('@', $email)[0];
        $existingUserCount = User::whereRaw('LOWER(SUBSTRING_INDEX(email, "@", 1)) = ?', [Str::lower($name)])->count();
        if ($existingUserCount > 0) {
            $name = $name . '_' . ($existingUserCount + 1);
        }
        $userIp = $request->ip();
        $user = User::create([
            'username' => null,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'referral_code' => $this->generateUniqueReferralCode(),
            'ip_address' => $userIp,
            'referred_by' => $referrerId,
            'role' => 'user',
        ]);

        // Create a free node for the user
        $miner = Miner::create([
            'user_id' => $user->id,
            'name' => 'Free Node',
            'node_id' => $this->generateUniqueNodeId(),
            'ip_address' => $this->generateRandomUSIp(),
            'level' => 1,
            'mining_speed' => 1,
            'is_mining' => 1,
            'is_active' => 1,
            'is_free' => 1,
            'earned_points' => 0,
        ]);
        event(new Registered($user));
        $existingReferral = User::where('ip_address', $userIp)
            ->whereHas('referredBy')
            ->exists();
        if ($referrer && !$existingReferral) {
            Referral::create([
                'referrer_id' => $referrer->id,
                'referred_user_id' => $user->id,
                'status' => 'pending',
            ]);
        }
        Auth::login($user);

        // return redirect(RouteServiceProvider::HOME);
        return response()->json([
            'message' => 'Account created successfully.',
            'user' => $user,
        ], 201);
    }

    private function generateUniqueNodeId(): string
    {
        $prefix = '14C4';
        $length = 52;

        do {
            $randomPart = Str::random($length - strlen($prefix));
            $nodeId = $prefix . $randomPart;
        } while (Miner::where('node_id', $nodeId)->exists());

        return $nodeId;
    }
    function generateRandomUSIp(): string {
        $ipBlocks = [
            ['start' => '3.0.0.0',    'end' => '3.255.255.255'],  // free miner
            // ['start' => '8.0.0.0',    'end' => '8.255.255.255'],
            // ['start' => '13.52.0.0',  'end' => '13.59.255.255'],
            // ['start' => '18.208.0.0', 'end' => '18.215.255.255'],
            // ['start' => '34.192.0.0', 'end' => '34.255.255.255'],
        ];

        $block = $ipBlocks[array_rand($ipBlocks)];
        $start = ip2long($block['start']);
        $end = ip2long($block['end']);
        $randomIp = long2ip(mt_rand($start, $end));

        return $randomIp;
    }

    function generateUniqueReferralCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (User::where('referral_code', $code)->exists());

        return $code;
    }
}
