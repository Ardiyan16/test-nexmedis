<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Notification;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ApiController extends Controller
{

    public function __construct() {
        date_default_timezone_set('Asia/Jakarta');
    }

    public function all_posts(Request $request)
    {
        // $data = DB::table('posts')
        // ->select('posts.*', 'users.username', 'users.images as image_profile')
        // ->leftJoin('users', 'users.id', '=', 'posts.user_id')
        // ->latest()
        // ->get();

        $userId = $request->user['id'];

        $data = DB::table('posts')
        ->join('users', 'posts.user_id', '=', 'users.id')
        ->leftJoin('likes as user_likes', function ($join) use ($userId) {
            $join->on('posts.id', '=', 'user_likes.post_id')
                ->where('user_likes.user_id', '=', $userId);
        })
        ->leftJoin('likes', 'posts.id', '=', 'likes.post_id')
        ->select(
            'posts.id',
            'posts.content',
            'posts.created_at',
            'users.username',
            'posts.total_like',
            'posts.total_comment',
            'posts.images',
            'users.images as image_profile',
            'user_likes.id as like_id',
            'users.id as user_id',
            DB::raw('CASE WHEN user_likes.id IS NOT NULL THEN true ELSE false END as liked_by_user')
        )
        ->groupBy('posts.id', 'posts.content', 'posts.created_at', 'users.username', 'user_likes.id')
        ->orderBy('posts.created_at', 'desc')
        ->get();

        if($data) {
            return response([
                'data' => $data,
            ], Response::HTTP_OK);
        }

        response([
            'messsage' => 'Not found'
        ], Response::HTTP_NOT_FOUND);
    }

    public function show_posts(Request $request, $id)
    {
        $userId = $request->user['id'];

        $data = DB::table('posts')
        ->join('users', 'posts.user_id', '=', 'users.id')
        ->leftJoin('likes as user_likes', function ($join) use ($userId) {
            $join->on('posts.id', '=', 'user_likes.post_id')
                ->where('user_likes.user_id', '=', $userId);
        })
        ->leftJoin('likes', 'posts.id', '=', 'likes.post_id')
        ->select(
            'posts.id',
            'posts.content',
            'posts.created_at',
            'users.username',
            'posts.total_like',
            'posts.total_comment',
            'posts.images',
            'users.images as image_profile',
            'user_likes.id as like_id',
            'users.id as user_id',
            DB::raw('CASE WHEN user_likes.id IS NOT NULL THEN true ELSE false END as liked_by_user')
        )
        ->where('posts.id', $id)
        ->first();

        $comment = DB::table('comments')
        ->select(
            'comments.*',
            'users.username',
            'users.images',
            'posts.total_comment'
        )
        ->leftJoin('users', 'users.id', '=', 'comments.user_id')
        ->leftJoin('posts', 'posts.id', '=', 'comments.post_id')
        ->where('posts.id', $id)
        ->orderBy('comments.id', 'desc')
        ->get();

        if($data) {
            return response([
                'data' => $data,
                'comment' => $comment
            ], Response::HTTP_OK);
        }

        response([
            'messsage' => 'Not found'
        ], Response::HTTP_NOT_FOUND);
    }

    public function add_posts(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required',
            // 'images' => 'mimes:jpeg,png,jpg|max:3072'
        ], [
            'content.required' => 'Content field is required.',
        ]);

        if ($validator->fails()) {
            return response([
                'message' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $image_name = '';
        if(!empty($request->file('images'))) {
            $images = $request->file('images');
            $image_name = time() . Str::random(5) . "_" . $images->getClientOriginalName();
            $folder = 'image/posts';
            $images->move($folder, $image_name);
        }

        $user_id = $request->user['id'];
        $value = [
            'user_id' => $user_id,
            'content' => $request->content,
            'images' => $image_name,
            'total_like' => 0,
            'total_comment' => 0
        ];

        $save = Post::create($value);
        if($save) {
            $query = User::where('id', $user_id);
            $data = $query->first();
            $total_posts = $data->total_posts;
            $query->update([
                'total_posts' => $total_posts + 1
            ]);
            return response([
                'message' => 'Posts successfully shared'
            ], Response::HTTP_CREATED);
        }

        return response([
            'message' => 'post failed to share'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function edit_posts(Request $request) 
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required',
            // 'images' => 'mimes:jpeg,png,jpg|max:3072'
        ], [
            'content.required' => 'Content field is required.',
        ]);

        if ($validator->fails()) {
            return response([
                'message' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $data = Post::where('id', $request->id)->first();
        if(!empty($request->file('images'))) {
            $images = $request->file('images');
            $image_name = time() . Str::random(5) . "_" . $images->getClientOriginalName();
            $folder = 'image/posts';
            $images->move($folder, $image_name);
            if(!empty($data->images)) {
                $image_path = public_path('image/posts/' . $data->images);
                if (file_exists($image_path)) {
                    unlink($image_path);
                }
            }
        } else {
            $image_name = $data->images;
        }

        $value = [
            'content' => $request->content,
            'images' => $image_name,
        ];

        $update = Post::where('id', $request->id)->update($value);
        if($update) {
            return response([
                'message' => 'Posts successfully updated'
            ], Response::HTTP_OK);
        }

        return response([
            'message' => 'post failed to updated'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function delete_posts($id)
    {
        $query = Post::where('id', $id);
        $data = $query->first();
        if(!empty($data->images)) {
            $image_path = public_path('image/posts/' . $data->images);
            if (file_exists($image_path)) {
                unlink($image_path);
            }
        }

        $delete = $query->delete();
        if($delete) {
            Comment::where('post_id', $data->id)->delete();
            Like::where('post_id', $data->id)->delete();
            Notification::where('post_id', $data->id)->delete();
            $query = User::where('id', $data->user_id);
            $data = $query->first();
            $total_posts = $data->total_posts;
            $query->update([
                'total_posts' => $total_posts - 1
            ]);
            return response([
                'message' => 'Posts successfully deleted'
            ], Response::HTTP_OK);
        }

        return response([
            'message' => 'Posts failed to delete'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function edit_profile(Request $request) 
    {
        $id = $request->user['id'];
        $user = User::where('id', $id)->first();
        if($user->username == $request->username) {
            $validator = Validator::make($request->all(), [
                'username' => 'required',
                'images' => 'mimes:jpeg,png,jpg|max:3072'
            ]);
        } else {
            $validator = Validator::make($request->all(), [
                'username' => 'required|unique:users,username',
                'images' => 'mimes:jpeg,png,jpg|max:3072'
            ]);
        }

        if ($validator->fails()) {
            return response([
                'info' => 'validation_error',
                'errors' => $validator->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $data = User::where('id', $request->user['id'])->first();
        if(!empty($request->file('images'))) {
            $images = $request->file('images');
            $image_name = time() . Str::random(5) . "_" . $images->getClientOriginalName();
            $folder = 'image/profile';
            $images->move($folder, $image_name);
            if(!empty($data->images)) {
                $image_path = public_path('image/profile/' . $data->images);
                if (file_exists($image_path)) {
                    unlink($image_path);
                }
            }
        } else {
            $image_name = $data->images;
        }

        $value = [
            'username' => $request->username,
            'images' => $image_name
        ];

        $update = User::where('id', $request->user['id'])->update($value);
        if($update) {
            return response([
                'message' => 'your profile has been updated successfully'
            ], Response::HTTP_OK);
        }

        return response([
            'message' => 'your profile failed to update'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);

    }

    public function add_like(Request $request)
    {
        $save = Like::create([
            'user_id' => $request->user['id'],
            'post_id' => $request->post_id
        ]);

        if($save) {
            $query = Post::where('id', $request->post_id);
            $data = $query->first();
            $total_like = $data->total_like;
            $query->update([
                'total_like' => $total_like + 1
            ]);
            if($request->user['id'] != $request->user_id) {
                Notification::create([
                    'post_id' => $request->post_id,
                    'user_id_post' => $request->user_id,
                    'user_id_like' => $request->user['id'],
                    'content' => 'menyukai postingan anda',
                    'status' => 0
                ]);
            }
            return response([
                'message' => 'Success'
            ], Response::HTTP_CREATED);
        }

        return response([
            'message' => 'Failed'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function delete_like($id) 
    {
        $query = Like::where('id', $id);
        $data = $query->first();
        $queryPost = Post::where('id', $data->post_id);
        $dataPost = $query->first();

        $delete = $query->delete();
        if($delete) {
            $total_like = $dataPost->total_like;
            if($total_like > 0) {
                $queryPost->update([
                    'total_like' => $total_like - 1
                ]);
            }
            return response([
                'message' => 'Success'
            ], Response::HTTP_OK);
        }

        return response([
            'message' => 'Failed'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function get_notif(Request $request)
    {
        $data_notif = DB::table('notifications as notif')
        ->select('notif.*', 'users.username')
        ->leftJoin('users', 'users.id', '=', 'notif.user_id_like')
        ->where('user_id_post', $request->user['id'])
        ->orderBy('id', 'desc')
        ->limit(30)
        ->get();
        $count = Notification::where('user_id_post', $request->user['id'])->where('status', 0)->count();

        if($data_notif) {
            return response([
                'data' => $data_notif,
                'count'=> $count
            ], Response::HTTP_OK);
        }

        return response([
            'count' => 0,
            'message' => 'Not Found'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function read_notif(Request $request)
    {
        $update = Notification::where('user_id_post', $request->user['id'])
        ->where('status', 0)
        ->update([
            'status' => 1
        ]);

        if($update) {
            return response([
                'message' => 'Successfully'
            ], Response::HTTP_OK);
        }

        return response([
            'message' => 'Failed'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function add_comment(Request $request)
    {
        $save = Comment::create([
            'post_id' => $request->post_id,
            'user_id' => $request->user['id'],
            'content' => $request->content
        ]);

        if($save) {
            $query = Post::where('id', $request->post_id);
            $data = $query->first();
            $total_comment = $data->total_comment;
            $query->update([
                'total_comment' => $total_comment + 1
            ]);
            if($request->user['id'] != $request->user_id) {
                Notification::create([
                    'post_id' => $request->post_id,
                    'user_id_post' => $request->user_id,
                    'user_id_like' => $request->user['id'],
                    'content' => 'mengomentari postingan anda',
                    'status' => 0
                ]);
            }

            return response([
                'message' => 'Success'
            ], Response::HTTP_CREATED);
        }

        return response([
            'message' => 'Failed'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }

    public function delete_comment($id)
    {
        $query = Comment::where('id', $id);
        $data = $query->first();
        $queryPost = Post::where('id', $data->post_id);
        $dataPost = $queryPost->first();
        $delete = $query->delete();
        if($delete) {
            $total_comment = $dataPost->total_comment;
            if($total_comment > 0) {
                $queryPost->update([
                    'total_comment' => $total_comment - 1
                ]);
            }
            return response([
                'message' => 'Success'
            ], Response::HTTP_OK);
        }

        return response([
            'message' => 'Failed'
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
