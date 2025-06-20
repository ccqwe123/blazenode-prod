<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use kornrunner\Keccak;
use kornrunner\Signature\Signature;
use kornrunner\Secp256k1;
use Elliptic\EC;
use Web3p\EthereumUtil\Util;
use App\Models\User;
use App\Models\Miner;
use kornrunner\Serializer\HexSignatureSerializer;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class Web3AuthController extends Controller
{
    const SIGN_MESSAGE = 'Please sign this message to authenticate';

    public function verifySignature(Request $request)
    {
        $address = strtolower($request->input('address'));
        $signature = $request->input('signedMessage');

        $util = new Util();

        $messageHash = $util->hashPersonalMessage(self::SIGN_MESSAGE);

        $sig = substr($signature, 2);

        $r = '0x' . substr($sig, 0, 64);
        $s = '0x' . substr($sig, 64, 64);
        $v = hexdec(substr($sig, 128, 2));

        if ($v >= 27) {
            $v = $v - 27;
        }

        // v and recId are usually same for Ethereum
        $recoveredPublicKey = $util->recoverPublicKey($messageHash, $r, $s, $v);

        $recoveredAddress = strtolower($util->publicKeyToAddress($recoveredPublicKey));

        \Log::info('Recovered Address: ' . $recoveredAddress);

        if ($recoveredAddress !== $address) {
            \Log::error('Signature does not match address');
            return response()->json(['error' => 'Invalid signature'], 401);
        }
        $check_user = User::where('wallet_address', $address)->first();
        if($check_user){
            $user = $check_user;
        }else{
            $userIp = $request->ip();
            $user = User::create([
                'wallet_address' => $address,
                'password' => Hash::make('blazenode_user!@#'),
                'role' => 'user',
                'email_verified_at' => \Carbon\Carbon::now(),
                'referral_code' => $this->generateUniqueReferralCode(),
                'ip_address' => $userIp,
            ]);

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
        }
        Auth::login($user);
        $token = $user->createToken($user->wallet_address . '_Token')->plainTextToken;
        info(Auth::user());
        return response()->json([
            'message' => 'Signature verified successfully',
            'token' => $token,
            'user' => $user
        ]);
    }

    private function hashPersonalMessage(string $message): string
    {
        $prefix = "\x19Ethereum Signed Message:\n" . strlen($message);
        return Keccak::hash($prefix . $message, 256);
    }

    private function recoverAddress(string $msgHash, string $signature): string
    {
        $sig = $this->parseSignature($signature);
        $recovery = $sig->getRecoveryParam();
        $r = gmp_init($sig->getR(), 16);
        $s = gmp_init($sig->getS(), 16);

        $secp256k1 = new Secp256k1();
        $pubKey = $secp256k1->recoverPublicKey($msgHash, $r, $s, $recovery);
        $pubKeyHex = substr($pubKey, 2);

        $address = '0x' . substr(Keccak::hash(hex2bin($pubKeyHex), 256), -40);

        return strtolower($address);
    }

    private function parseSignature(string $signature): Signature
    {
        $sig = substr($signature, 2);
        $r = gmp_init(substr($sig, 0, 64), 16);
        $s = gmp_init(substr($sig, 64, 64), 16);
        $v = hexdec(substr($sig, 128, 2));
        if ($v >= 27) {
            $v -= 27;
        }
        return new Signature($r, $s, $v);
    }

    function generateUniqueReferralCode(): string
    {
        do {
            $code = strtoupper(Str::random(6));
        } while (User::where('referral_code', $code)->exists());

        return $code;
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
}
