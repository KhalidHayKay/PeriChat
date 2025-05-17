<?php

namespace App\DTOs;

use App\Enums\ConversationTypeEnum;
use App\Models\Group;
use App\Models\User;
use Carbon\Carbon;

/**
 * Responsible for transforming User or Group models into a standardized
 * format for conversation UI representation
 */
class ConversationSubjectsDTO
{
    private ConversationTypeEnum $type;
    private ?string              $lastMessageDate;
    private ?int                 $unread          = null;

    /**
     * @param User|Group $model The model representing either a user or group
     * @param int|null $conversationId Optional ID of the conversation
     * @param array<int,int>|null $unreadCounts Optional array of unread message counts keyed by ID
     */
    public function __construct(
        private readonly User|Group $model,
        private readonly ?int $conversationId = null,
        private readonly ?array $unreadCounts = null,
    ) {
        $this->type            = $this->determineConversationType();
        $this->lastMessageDate = $this->formatLastMessageDate();
        $this->unread          = $this->resolveUnreadCount();
    }

    private function determineConversationType(): ConversationTypeEnum
    {
        return $this->model instanceof User
            ? ConversationTypeEnum::PRIVATE
            : ConversationTypeEnum::GROUP;
    }

    private function formatLastMessageDate(): ?string
    {
        if (! $this->model->last_message_date) {
            return null;
        }

        return Carbon::parse($this->model->last_message_date)
            ->setTimezone('UTC')
            ->toIso8601String();
    }

    private function resolveUnreadCount(): ?int
    {
        // If we have unreadCounts array data
        if ($this->unreadCounts !== null) {
            if ($this->model instanceof User) {
                $lookupId = $this->conversationId ?? $this->model->c_id ?? null;
                return $lookupId ? ($this->unreadCounts[$lookupId] ?? 0) : null;
            }

            return $this->unreadCounts[$this->model->id] ?? null;
        }

        // If we have a conversation ID, use model methods to get counts
        if ($this->conversationId !== null) {
            return $this->model instanceof User
                ? $this->model->getUnreadCount($this->conversationId)
                : $this->model->getUnreadCount();
        }

        return null;
    }

    public function toArray(): array
    {
        return [
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
    }
}
