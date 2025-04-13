<?php

// use Illuminate\Http\Request;

use App\Http\Controllers\ApiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Middleware\IsApi;

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

Route::post('login', [LoginController::class, 'action_login']);
Route::post('register', [LoginController::class, 'register']);
Route::post('forgot', [LoginController::class, 'forgot_password']);
Route::prefix('v1')->middleware(IsApi::class)->group(function () {
    Route::get('check-user', [LoginController::class, 'check_user']);
    Route::get('user', [LoginController::class, 'get_user']);

    Route::prefix('posts')->group(function() {
        Route::get('/', [ApiController::class, 'all_posts']);
        Route::get('/show/{id}', [ApiController::class, 'show_posts']);
        Route::post('/add', [ApiController::class, 'add_posts']);
        Route::post('/edit', [ApiController::class, 'edit_posts']);
        Route::get('/delete/{id}', [ApiController::class, 'delete_posts']);
    });
    
    Route::post('/edit-profile', [ApiController::class, 'edit_profile']);
    Route::get('/notif', [ApiController::class, 'get_notif']);
    Route::get('/read-notif', [ApiController::class, 'read_notif']);

    Route::prefix('like')->group(function() {
        Route::post('/add', [ApiController::class, 'add_like']);
        Route::get('/delete/{id}', [ApiController::class, 'delete_like']);
    });

    Route::prefix('comments')->group(function() {
        Route::post('/add', [ApiController::class, 'add_comment']);
        // Route::post('/edit', [ApiController::class, 'edit_posts']);
        Route::get('/delete/{id}', [ApiController::class, 'delete_comment']);
    });
});


