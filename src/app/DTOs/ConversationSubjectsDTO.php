<?php

namespace App\DTOs;

use App\Enums\ConversationTypeEnum;
use App\Models\Group;
use App\Models\User;
use Carbon\Carbon;

class ConversationSubjectsDTO
{
    private ConversationTypeEnum $type;
    private ?string              $lastMessageDate;
    private ?int                 $unread          = null;

    public function __construct(
        private User|Group $model,
        private ?int $conversationId = null,
        private ?array $unreadCounts = null,
    ) {
        $this->type            = $model instanceof User ? ConversationTypeEnum::PRIVATE : ConversationTypeEnum::GROUP;
        $this->lastMessageDate = $this->model->last_message_date ?
            Carbon::parse($this->model->last_message_date)->setTimezone('UTC')->toIso8601String() : null;

        if ($unreadCounts) {
            $this->unread = $this->model instanceof User
                ? ($unreadCounts[$this->c_id ?? $this->conversationId] ?? 0)
                : ($unreadCounts[$this->model->id] ?? 0);
        }

        if ($conversationId) {
            $this->unread = $this->model instanceof User
                ? $this->model->getUnreadCount($this->conversationId)
                : $this->model->getUnreadCount();
        }
    }

    public function toArray(): array
    {
        $data = [
            'id'                         => $this->model->c_id ?? $this->conversationId,
            'name'                       => $this->model->name,
            'avatar'                     => $this->model->avatar,
            'type'                       => $this->type,
            'typeId'                     => $this->model->id,
            'lastMessage'                => $this->model->last_message,
            'lastMessageAttachmentCount' => $this->model->last_message_attachment_count,
            'lastMessageDate'            => $this->lastMessageDate,
            'lastMessageSenderId'        => $this->model->last_message_sender,
            'unreadMessageCount'         => $this->unread,
        ];

        return $data;
    }
}
