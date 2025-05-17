<?php

namespace App\Http\Controllers;

use App\Enums\ConversationTypeEnum;
use App\Http\Resources\GroupResource;
use App\Http\Resources\UserResource;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class ConversationController extends Controller
{
    public function getSubjects(Request $request): Collection
    {
        return Conversation::getExistingSubjects($request->user());
    }

    public function getGroups(Request $request)
    {
        $subjects = Conversation::getNewGroupSubjects($request->user());

        return GroupResource::collection($subjects);
    }

    public function getUsersForGroup(Request $request)
    {
        $subjects = Conversation::getUsersForNewGroup($request->user());

        return UserResource::collection($subjects);
    }

    public function getAppUsers(Request $request)
    {
        $subjects = Conversation::getNewUserSubjects($request->user());

        return UserResource::collection($subjects);
    }

    public function markRead(Conversation $conversation)
    {
        $updated = $this->getUserRelationship($conversation)
            ->updateExistingPivot(Auth::id(), ['unread_messages_count' => 0,]);

        if ($updated) {
            return response(['message' => 'Unread count reset successfully']);
        }

        return response(['message' => 'No unread count to reset or update failed']);
    }

    public function incrementUnread(Message $message)
    {
        $affected = $this->getUserRelationship($message->conversation)
            ->where('user_id', Auth::id())->increment('unread_messages_count');

        if ($affected > 0) {
            return response(['message' => 'Unread count incremented successfully']);
        }

        return response(['message' => 'Unread count not updated or already up-to-date']);
    }

    private function getUserRelationship(Conversation $conversation)
    {
        return ConversationTypeEnum::isPrivate($conversation)
            ? $conversation->users()
            : $conversation->group->users();
    }

}
