<?php

namespace App\Http\Controllers;

use App\Enums\ConversationTypeEnum;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    public function markRead(Conversation $conversation)
    {
        $updated = $this->getConversationUserRelationship($conversation)
            ->updateExistingPivot(Auth::id(), ['unread_messages_count' => 0,]);

        if ($updated) {
            return response(['message' => 'Unread count reset successfully']);
        }

        return response(['message' => 'No unread count to reset or update failed']);
    }

    public function incrementUnread(Message $message)
    {
        $affected = $this->getConversationUserRelationship($message->conversation)
            ->where('user_id', Auth::id())->increment('unread_messages_count');

        if ($affected > 0) {
            return response(['message' => 'Unread count incremented successfully']);
        }

        return response(['message' => 'Unread count not updated or already up-to-date']);
    }

    private function getConversationUserRelationship(Conversation $conversation)
    {
        return ConversationTypeEnum::isPrivate($conversation)
            ? $conversation->users()
            : $conversation->group->users();
    }

}
