<?php

namespace App\Http\Middleware;

use App\Http\Controllers\LoginController;
use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsApi
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->header('token');
        $user_id = $request->header('user_id');
        $code = $request->header('code');
        $exp_token = $request->header('exp_token');

        if(empty($token) || empty($user_id) || empty($code) || empty($exp_token)) {
            return response([
                'status' => false,
                'message' => "You don't have access, please relogin"
            ], Response::HTTP_UNAUTHORIZED);
        }

        $util = new LoginController();
        $cek_token = $util->build_token($user_id, $code);
        if($token != $cek_token) {
            return response([
                'status' => false,
                'message' => 'Token invalid'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $cek_exp = $util->base64_to_datetime($exp_token);
        if(strtotime('now') >= strtotime($cek_exp)) {
            return response([
                'status' => false,
                'message' => 'Your token expired! please relogin'
            ], Response::HTTP_UNAUTHORIZED);
        }
        
        $user = User::where('id', $user_id)->first();
        if(empty($user)) {
            return response([
                'status' => false,
                'message' => 'User not found, please relogin'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user['id'] = $user->id;
        $user['code'] = $code;
        $user['token'] = $token;
        $user['exp_token'] = $cek_exp;
        $request->merge(['user' => $user]);

        return $next($request);
    }
}
