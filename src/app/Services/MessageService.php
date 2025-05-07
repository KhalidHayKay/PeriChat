<?php

namespace App\Services;

use App\Enums\ConversationTypeEnum;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageAttachment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MessageService
{
    public function storeMessage(array $verData): Message
    {
        $verData['sender_id'] = Auth::id();
        $verData['read_at']   = now();

        $conversation               = $this->resolveConversation($verData);
        $verData['conversation_id'] = $conversation->id;

        $files = $verData['attachments'] ?? null;
        unset($verData['attachments']);

        $message = Message::create($verData);
        $conversation->update(['last_message_id' => $message->id]);

        if ($files) {
            $attachments          = $this->handleAttachments($files, $message->id);
            $message->attachments = $attachments;
        }

        return $message;
    }

    private function resolveConversation(array $data): Conversation
    {
        if (array_key_exists('group_id', $data)) {
            return Conversation::getMessageConversation(
                ConversationTypeEnum::GROUP,
                $data['group_id']
            );
        }

        return Conversation::getMessageConversation(
            ConversationTypeEnum::PRIVATE ,
            participants: [$data['receiver_id'], $data['sender_id']]
        );
    }

    private function handleAttachments(array $files, int $messageId): array
    {
        $attachments = [];

        foreach ($files as $file) {
            $dir = 'attachments/' . Str::random(32);
            Storage::makeDirectory($dir);

            $attachments[] = MessageAttachment::create([
                'message_id' => $messageId,
                'name'       => $file->getClientOriginalName(),
                'mime'       => $file->getClientMimeType(),
                'size'       => $file->getSize(),
                'path'       => $file->store($dir, 'public'),
            ]);
        }

        return $attachments;
    }
}
