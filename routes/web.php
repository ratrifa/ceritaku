<?php

use App\Http\Controllers\CerpenController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('landing');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('home');
    })->name('dashboard');

    Route::get('home', function () {
        return Inertia::render('home');
    })->name('home');

    Route::get('cerpen', [CerpenController::class, 'index'])->name('cerpen.index');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
