<?php

namespace App\Http\Controllers;

use App\Enums\ConversationTypeEnum;
use App\Events\SocketMessage;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Resources\MessageResource;
use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::select(['messages.*'])
            ->where('c.type', '=', ConversationTypeEnum::PRIVATE ->value)
            ->where('sender_id', '=', Auth::id())
            ->Where('receiver_id', '=', $user->id)
            ->orWhere('sender_id', '=', $user->id)
            ->where('receiver_id', '=', Auth::id())
            ->leftJoin('conversations as c', 'messages.conversation_id', '=', 'c.id')
            ->latest()
            ->paginate(10)
        ;

        $conversationId = $messages->isNotEmpty() ? $messages->first()->conversation_id : null;

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray($conversationId),
            'messages'             => MessageResource::collection($messages),
        ]);
    }

    public function byGroup(Group $group)
    {
        $messages = Message::select(['messages.*', 'c.group_id'])
            ->where('c.type', '=', ConversationTypeEnum::GROUP->value)
            ->where('c.group_id', '=', $group->id)
            ->leftJoin('conversations as c', 'messages.conversation_id', '=', 'c.id')
            ->latest()
            ->paginate(10)
        ;

        $conversationId = $messages->isNotEmpty() ? $messages->first()->conversation_id : null;

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray($conversationId),
            'messages'             => MessageResource::collection($messages),
        ]);
    }

    public function loadOlder(Message $message)
    {
        $messages = Message::where('created_at', '<', $message->created_at)
            ->where('conversation_id', '=', $message->conversation->id)
            ->latest()
            ->paginate(10)
        ;

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request)
    {
        $data              = $request->validated();
        $data['sender_id'] = Auth::id();

        if (array_key_exists('group_id', $data)) {
            $conversation = Conversation::getMessageConversation(
                ConversationTypeEnum::GROUP,
                $data['group_id'],
            );
        } else if (array_key_exists('receiver_id', $data)) {
            $conversation = Conversation::getMessageConversation(
                ConversationTypeEnum::PRIVATE ,
                participants: [$data['receiver_id'], $data['sender_id']]
            );
        }

        $data['conversation_id'] = $conversation->id;
        $data['read_at']         = now();

        $files = $data['attachments'] ?? null;

        // dd($data);
        $message = Message::create($data);
        $conversation->update(['last_message_id' => $message->id]);

        $attachments = [];
        if ($files) {
            foreach ($files as $file) {
                $dir = 'attachments/' . Str::random(32);
                Storage::makeDirectory($dir);

                $model = [
                    'message_id' => $message->id,
                    'name'       => $file->getClientOriginalName(),
                    'mime'       => $file->getClientMimeType(),
                    'size'       => $file->getSize(),
                    'path'       => $file->store($dir, 'public'),
                ];

                $attachments[] = MessageAttachment::create($model);
            }

            $message->attachments = $attachments;
        }

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
