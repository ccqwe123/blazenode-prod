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
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use App\Services\BrevoMailer;

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
    public function store(Request $request, BrevoMailer $mailer): JsonResponse
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

        $html = $this->emailTemplate($user);
        $mailer->send(
            $user->email,
            $user->username ?? 'New User',
            'Verify your email address',
            $html
        );
        // event(new Registered($user));
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
        info("success register");
        // return redirect(RouteServiceProvider::HOME);
        return response()->json([
            'message' => 'Account created successfully.',
            'user' => $user,
        ], 201);
    }

    public function emailTemplate($user)
    {
        $verifyUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );
        $logoUrl = 'https://blazenode.io/blazenode-logo.png';
        $html = '
            <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 40px;">
            <div style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 10px; padding: 40px; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
                <div style="text-align: center; margin-bottom: 30px;">
                <img src="' . $logoUrl . '" alt="Blazenode" style="height: 100px;" />
                </div>
                <h2 style="text-align: center; color: #000;">Verify This Email Address</h2>
                <p>Hi ' . ($user->username ?? 'there') . ',</p>
                <p>Welcome to <strong>Blazenode</strong>!</p>
                <p>Please click the button below to verify your email address.</p>

                <div style="text-align: center; margin: 30px 0;">
                <a href="' . $verifyUrl . '" style="
                    background-color: #1d72b8;
                    color: white;
                    padding: 14px 28px;
                    text-decoration: none;
                    border-radius: 6px;
                    font-weight: bold;
                    display: inline-block;
                ">Verify Email</a>
                </div>

                <p>If you did not sign up to Blazenode, please ignore this email or contact us at info@blazenode.io.</p>
                <p>— Blazenode Support Team</p>

                <hr style="margin: 40px 0;">

                <div style="text-align: center;">
                <a href="https://twitter.com/blazenode" style="margin: 0 10px;">
                    <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" width="24">
                </a>
                <a href="https://t.me/blazenode" style="margin: 0 10px;">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111646.png" alt="Telegram" width="24">
                </a>
                <a href="https://discord.gg/blazenode" style="margin: 0 10px;">
                    <img src="https://cdn-icons-png.flaticon.com/512/2111/2111370.png" alt="Discord" width="24">
                </a>
                </div>

                <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
                Need support? Feel free to email us anytime. We’ll be happy to help!
                </p>
            </div>
        </div>';
        return $html;
    }

    public function resend(Request $request, BrevoMailer $mailer)
    {
        $user = $request->user();
        if ($user->hasVerifiedEmail()) {
            return redirect()->intended('/dashboard');
        }
        $verifyUrl = URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );
        $html = $this->emailTemplate($user);
        $mailer->send(
            $user->email,
            $user->username ?? 'New User',
            'Verify your email address',
            $html
        );
        return back()->with('message', 'Verification link sent!');

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
