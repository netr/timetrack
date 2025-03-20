<?php

use App\Http\Controllers\TimeEntryController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::group(['prefix' => 'time-entries'], function () {
        Route::get('/', [TimeEntryController::class, 'index'])->name('time-entries.index');
        Route::post('/', [TimeEntryController::class, 'store'])->name('time-entries.store');
        Route::put('/{timeEntry}', [TimeEntryController::class, 'update'])->name('time-entries.update');
        Route::delete('/{timeEntry}', [TimeEntryController::class, 'destroy'])->name('time-entries.destroy');
    });
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
