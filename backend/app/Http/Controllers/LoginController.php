<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\User_role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;
// use Tymon\JWTAuth\Facades\JWTAuth;
// use Tymon\JWTAuth\Exceptions\JWTException;

class LoginController extends Controller
{
    const SALT = '6UejnN';

    public function __construct() {
        date_default_timezone_set('Asia/Jakarta');
    }

    public function datetime_to_base64($date)
    {
        return base64_encode($date);
    }

    public function base64_to_datetime($base64) 
    {
        return base64_decode($base64);
    }

    public function build_token($id, $code)
    {
        return md5(self::SALT.$id.$code);
    }

    public function action_login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username_email' => 'required',
            'password' => 'required',
        ], [
            'username_email.required' => 'The username or password field is required.',
        ]);

        if ($validator->fails()) {
            return response([
                'status' => false,
                'info' => 'validation_error',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = User::where('email', $request->username_email)
        ->orWhere('username', $request->username_email)
        ->first();
        if(!$user) {
            return response([
                'status' => false,
                'message' => 'your email or username is wrong!'
            ], Response::HTTP_UNAUTHORIZED);
        }

        if(!Hash::check($request->password, $user->password)) {
            return response([
                'status' => false,
                'message' => 'your password is wrong!'
            ], Response::HTTP_UNAUTHORIZED);
        }

        if($user->status != 'active') {
            return response([
                'status' => false,
                'message' => 'your account is inactive!'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $code = rand(1234, 9879);
        $token = $this->build_token($user->id, $code);
        $exp_token = $this->datetime_to_base64(date('Y-m-d H:i:s', strtotime("+7 days")));
        $data = [
            'token' => $token,
            'code' => $code,
            'exp_token' => $exp_token,
            'user_id' => $user->id,
        ];

        return response([
            'status' => true,
            'data' => $data,
            'message' => 'Successful login will redirect to the main page'
        ], Response::HTTP_OK);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|unique:users,username',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response([
                'info' => 'validation_error',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $value = [
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => $request->email_verified_at,
            'status' => 'active',
            'total_posts' => 0,
            'total_like' => 0
        ];

        $save = User::create($value);
        if($save) {
            return response([
                'message' => 'Your account has been successfully registered, Please login'
            ], Response::HTTP_CREATED);
        }

        return response([
            'message' => 'your account failed to register'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function forgot_password(Request $request) 
    {
        $validator = Validator::make($request->all(), [
            'username_email' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response([
                'info' => 'validation_error',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = User::where(function ($query) use ($request) {
            $query->where('email', $request->username_email)
                ->orWhere('username', $request->username_email);
        })
        ->where('status', 'active')
        ->first();

        if(empty($user)) {
            return response([
                'message' => 'Account not found, please register first.'
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $update = User::where('email', $request->username_email)
        ->orWhere('username', $request->username_email)->update([
            'password' => Hash::make($request->password)
        ]);

        if($update) {
            return response([
                'message' => 'Password successfully updated'
            ], Response::HTTP_OK);
        }

        return response([
            'message' => 'Password updated failed'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function check_user(Request $request)
    {
        $id = $request->user['id'];
        $user = User::where('id', $id)->first();
        if($user) {

            $cek_token = $this->build_token($user->id, $request->user['code']);
            if($cek_token != $request->user['token']) {
                return response([
                    'status' => false,
                    'message' => 'Token is invalid, please relogin'
                ], Response::HTTP_UNAUTHORIZED);
            }

            if(strtotime('now') >= strtotime($request->user['exp_token'])) {
                return response([
                    'status' => false,
                    'message' => 'Token expired, please relogin'
                ], Response::HTTP_UNAUTHORIZED);
            }

            return response([
                'status' => true,
                'data' => $user,
                'message' => 'Ok'
            ], Response::HTTP_OK);
        }

        return response([
            'status' => false,
            'message' => 'User not found, please relogin'
        ], Response::HTTP_NOT_FOUND);
    }

    public function get_user(Request $request)
    {
        $id = $request->user['id'];
        $user = User::where('id', $id)->first();
        if($user) {
            return response([
                'status' => true,
                'data' => $user,
                'message' => 'Ok'
            ], Response::HTTP_OK);
        }

        return response([
            'status' => false,
        ], Response::HTTP_NOT_FOUND);
    }


}
