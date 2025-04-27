<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/', [HomeController::class, 'index'])->name('home');

    Route::get('/user/{user}', [MessageController::class, 'byuser'])->name('conversation.private');
    Route::get('/group/{group}', [MessageController::class, 'byGroup'])->name('conversation.group');

    Route::post('/message', [MessageController::class, 'store'])->name('message.store');
    Route::delete('/message', [MessageController::class, 'destroy'])->name('message.destroy');

    Route::get('/message/older/{message}', [MessageController::class, 'loadOlder'])->name('message.loadOlder');

    Route::post('/message/unread/{message}', [ConversationController::class, 'incrementUnread'])->name('message.incrementUnread');
    Route::post('/message/read/{conversation}', [ConversationController::class, 'markRead'])->name('message.markRead');
});

Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('account.profile');
    Route::get('/settings', [ProfileController::class, 'edit'])->name('account.settings');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
