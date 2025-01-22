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

        return inertia('Home', [
            'selectedConversation' => $user->toConversationArray(),
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

        return inertia('Home', [
            'selectedConversation' => $group->toConversationArray(),
            'messages'             => MessageResource::collection($messages),
        ]);
    }

    public function loadOlder(Message $message)
    {
        $messages = Message::where('')
            ->latest()
            ->paginate(10)
        ;

        return MessageResource::collection($messages);
    }

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();

        $conversation = Conversation::firstOrCreate([
            'receiver_id' => $data->receiverId ?? null,
            'group_id'    => $data->groupId ?? null,
            'type'        => $data->type,
        ]);

        $data['sender_id']       = Auth::id();
        $data['conversation_id'] = $conversation->id;

        $files = $data['attachments'] ?? null;

        $message = Message::create($data);

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

            $message->attahcments = $attachments;
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
