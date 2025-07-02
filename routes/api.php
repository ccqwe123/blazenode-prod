<?php

use App\Http\Controllers\EarlyAccessController;
use App\Http\Controllers\MinerController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Web3AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// Route::post('/miners/{miner}/start', [MinerController::class, 'start'])->middleware('auth')->name('miners.start');
Route::middleware('auth:sanctum')->get('/check-token', function () {
    return response()->json(['user' => Auth::user()]);
});
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [MinerController::class, 'me']);

    Route::get('/user/nodes', [MinerController::class, 'userMiners']);
    Route::post('/nodes/{miner}/start', [MinerController::class, 'startv2']);
    Route::get('/user/points', [MinerController::class, 'points']);
    Route::get('/user/points/daily', [MinerController::class, 'pointsDaily']); //chart points daily
    Route::post('/user/node/upgrade/step1', [MinerController::class, 'upgrade']);
    Route::post('/user/node/upgrade/complete', [MinerController::class, 'upgradeNode']);
    Route::get('/reward/status', [UserController::class, 'rewardStatus']);
    Route::post('/reward/claim', [UserController::class, 'claimReward']);
});

Route::post('/web3/verify-signature', [Web3AuthController::class, 'verifySignature']);
Route::get('/early-access', [EarlyAccessController::class, 'store']);
Route::post('/early-access/{action}', [EarlyAccessController::class, 'show']);
Route::post('/waitlist', [EarlyAccessController::class, 'waitlist']);
Route::post('/early-user',[EarlyAccessController::class, 'createUser']);
Route::get('/early-users/leaderboard',[EarlyAccessController::class, 'leaderboard']);


