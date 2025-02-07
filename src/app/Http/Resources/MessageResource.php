<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    public static $wrap = null;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'message'     => $this->message,
            'senderId'    => (int) $this->sender_id,
            'receiverId'  => (int) $this->receiver_id,
            'groupId'     => $this->conversation->group_id,
            'sender'      => new UserResource($this->sender),
            'attachments' => $this->attachments ? MessageAttachmentResource::collection($this->attachments) : null,
            'createdAt'   => $this->created_at,
        ];
    }
}
