<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Message;
use App\Events\MessageEvent;
use DB;

class ChatsController extends Controller
{
    public function __construct()
{
  $this->middleware('auth');
}

/**
 * Show chats
 *
 * @return \Illuminate\Http\Response
 */
public function index()
{
  return view('home');
}

public function fetchUsers(){
  $user_arr = array();
  $arr = User::all();
  foreach($arr as $a){
    if($a->id == Auth::user()->id){}
    else{
      array_push($user_arr,$a);
    }
  }
  return json_encode($user_arr);
}

/**
 * Fetch all messages
 *
 * @return Message
 */
public function fetchMessages(Request $req)
{
  $sender_id = Auth::user()->id;
  $rec_id = $req->input('rec_id');
  $msg_list = DB::select('select * from messages where sender_id = '.$sender_id.' and rec_id = '.$rec_id);
  //$msg_list = Message::where('sender_id',$sender_id)->first();
  return json_encode($msg_list);
}

/**
 * Persist message to database
 *
 * @param  Request $request
 * @return Response
 */
public function sendMessage(Request $request)
{
  $user = Auth::user();

  $m = new Message();
  $m->sender_id = $user->id;
  $m->rec_id = $request->input('rec_id');
  $m->message = $request->input('message');
  $m->save();
  
  // $message = $user->messages()->create([
  //   'rec_id' => $request->input('rec_id'),
  //   'message' => $request->input('message')
  // ]);

  broadcast(new MessageEvent($user->id,$request->input('rec_id'),$request->input('message')));

  return ['success'=>'msg sent'];
}
}
