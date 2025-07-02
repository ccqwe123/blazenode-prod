<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web3AuthController;
use App\Http\Controllers\CheckInController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;
use App\Http\Controllers\EarlyAccessController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/kill-user', function () { Auth::logout(); return redirect('/login'); });

Route::get('/', function () {
    // return view('wait');
    return redirect('/login');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/nodes', fn () => Inertia::render('Nodes'))->name('nodes');
    Route::get('/referrals', fn () => Inertia::render('Referral'))->name('referrals');
    Route::get('/profile', fn () => Inertia::render('ProfileView'))->name('profile.view');
    Route::post('/daily-checkin', [CheckInController::class, 'claim']);
});
Route::middleware(['web'])->group(function () {
    Route::get('/csrf-token', function () {
        return response()->json(['csrf' => csrf_token()]);
    });
});

// Route::middleware('auth')->group(function () {
//     Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
//     Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
//     Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
// });
Route::get('/abc123', [EarlyAccessController::class, 'counter']);
require __DIR__.'/auth.php';
