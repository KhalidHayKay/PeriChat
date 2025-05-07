<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Group;
use App\Models\Message;
use App\Events\SocketMessage;
use App\Services\MessageService;
use Illuminate\Support\Facades\Auth;
use App\DTOs\ConversationSubjectsDTO;
use App\Http\Resources\MessageResource;
use App\Http\Requests\StoreMessageRequest;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::privateBetween($user);

        $conversationId = $messages->isNotEmpty() ? $messages->first()->conversation_id : null;

        return inertia('Home', [
            'selectedConversation' => (new ConversationSubjectsDTO($user, $conversationId))->toArray(),
            'messages'             => MessageResource::collection($messages),
        ]);
    }

    public function byGroup(Group $group)
    {
        $messages = Message::forGroup($group);

        $conversationId = $messages->isNotEmpty() ? $messages->first()->conversation_id : null;

        return inertia('Home', [
            'selectedConversation' => (new ConversationSubjectsDTO($group, $conversationId))->toArray(),
            'messages'             => MessageResource::collection($messages),
        ]);
    }

    public function loadOlder(Message $message)
    {
        return MessageResource::collection(Message::older($message));
    }

    public function store(StoreMessageRequest $request, MessageService $messageService)
    {
        $data = $request->validated();

        $message = $messageService->storeMessage($data);

        SocketMessage::dispatch($message);

        return new MessageResource($message);
    }

    public function destroy(Message $message)
    {
        if ($message->sender_id !== Auth::id()) {
            return response()->json(['message' => 'forbidden'], 403);
        }

        $message->delete();

        return response('', 204);
    }
}
