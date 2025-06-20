<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Web3AuthController;
use App\Http\Controllers\CheckInController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Artisan;
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
Route::get('/migrate', function () {
    Artisan::call('migrate', ['--force' => true]);
    return 'Migrations done!';
});
Route::get('/migrate-fresh', function () {
    Artisan::call('migrate:fresh');
    return 'Migrations done!';
});
Route::get('/logout', function () { Auth::logout(); return redirect('/login'); });

Route::get('/', function () {
    return view('wait');
    // return redirect('/login');
});
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn () => Inertia::render('Dashboard'))->name('dashboard');
    Route::get('/nodes', fn () => Inertia::render('Nodes'))->name('nodes');
    Route::get('/referrals', fn () => Inertia::render('Referral'))->name('referrals');
    Route::post('/daily-checkin', [CheckInController::class, 'claim']);
});
Route::middleware(['web'])->group(function () {
    Route::get('/csrf-token', function () {
        return response()->json(['csrf' => csrf_token()]);
    });
});
// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/dashboard', function () {
//         return Inertia::render('Dashboard', [
//             'auth' => [
//                 'user' => Auth::user(),
//             ],
//         ]);
//     })->name('dashboard');

//     Route::get('/nodes', function () {
//         return Inertia::render('Miners', [
//             'auth' => Auth::user(),
//         ]);
//     })->name('miners');
// });

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
