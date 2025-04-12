<?php

namespace App\Http\Controllers;

use App\Enums\ConversationTypeEnum;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ConversationController extends Controller
{
    public function markRead(Message $message)
    {
        $conversation = ($message->conversation->type === ConversationTypeEnum::PRIVATE ->value) ?
            DB::table('user_conversation')
                ->where('conversation_id', $message->conversation_id)
                ->where('user_id', Auth::id())
            :
            DB::table('group_users')
                ->where('group_id', $message->conversation->group_id)
                ->where('user_id', Auth::id())
        ;

        $affectedRows = $conversation->update(['unread_messages_count' => 0]);

        return $affectedRows
            ? response()->json(['message' => 'Unread count reset successfully'], 200)
            : response()->json(['message' => 'No unread messages found or reset failed'], 400);
    }

    public function incrementUnread(Message $message)
    {
        if ($message->conversation->type === ConversationTypeEnum::PRIVATE ->value) {
            $q = DB::table('user_conversation')
                ->where('conversation_id', $message->conversation_id)
                ->where('user_id', Auth::id())
                ->where('user_id', '!=', $message->sender_id)
                ->increment('unread_messages_count')
            ;
        } else {
            DB::table('group_user')
                ->where('group_id', $message->conversation->group_id)
                ->where('user_id', Auth::id())
                ->where('user_id', '!=', $message->sender_id)
                ->increment('unread_messages_count')
            ;
        }

        return response(['message' => 'unread count incremented successfully']);
    }
}
