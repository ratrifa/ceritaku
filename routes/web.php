<?php

use App\Http\Controllers\CerpenController;
use App\Http\Controllers\PublicProfileController;
use App\Models\Cerpen;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $stories = Cerpen::query()
        ->where('status', 'published')
        ->with('user:id,name,username')
        ->withCount('likes')
        ->latest()
        ->limit(6)
        ->get(['id', 'title', 'slug', 'content', 'user_id']);

    return Inertia::render('welcome', [
        'stories' => $stories,
    ]);
})->name('landing');

Route::get('cerpen/{id}', [CerpenController::class, 'show'])->name('cerpen.show');
Route::get('/@{username}', [PublicProfileController::class, 'show'])
    ->where('username', '[A-Za-z0-9_-]+')
    ->name('profile.public');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', fn () => redirect()->route('home'))->name('dashboard');

    Route::get('home', [CerpenController::class, 'home'])->name('home');
    Route::get('reading-list', [CerpenController::class, 'readingList'])->name('reading-list');

    Route::get('cerpen', [CerpenController::class, 'index'])->name('cerpen.index');
    Route::post('cerpen', [CerpenController::class, 'store'])->name('cerpen.store');
    Route::put('cerpen/{cerpen}', [CerpenController::class, 'update'])->name('cerpen.update');
    Route::delete('cerpen/{cerpen}', [CerpenController::class, 'destroy'])->name('cerpen.destroy');
    Route::post('cerpen/{cerpen}/like', [CerpenController::class, 'toggleLike'])->name('cerpen.like.toggle');
    Route::post('cerpen/{cerpen}/bookmark', [CerpenController::class, 'toggleBookmark'])->name('cerpen.bookmark.toggle');
    Route::post('cerpen/{cerpen}/comments', [CerpenController::class, 'storeComment'])->name('cerpen.comments.store');
    Route::delete('cerpen/{cerpen}/comments/{comment}', [CerpenController::class, 'destroyComment'])->name('cerpen.comments.destroy');
    Route::post('users/{user}/follow', [PublicProfileController::class, 'toggleFollow'])->name('users.follow.toggle');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
