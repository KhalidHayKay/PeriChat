<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('dashboard');

    Route::get('/user/{user}', [MessageController::class, 'byuser'])->name('conversation.private');
    Route::get('/group/{group}', [MessageController::class, 'byGroup'])->name('conversation.group');

    Route::post('/message', [MessageController::class, 'store'])->name('message.store');
    Route::delete('/message', [MessageController::class, 'destroy'])->name('message.destroy');

    Route::get('/message/load-older', [MessageController::class, 'loadOlder'])->name('message.loadOlder');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
