<?php

namespace App\Models;

use App\Enums\ConversationTypeEnum;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',
        'sender_id',
        'receiver_id',
        'conversation_id',
    ];

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function conversation(): BelongsTo
    {
        return $this->belongsTo(Conversation::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(MessageAttachment::class);
    }

    public function scopePrivateBetween(Builder $query, User $otherUser)
    {
        return $query->select('messages.*')
            ->where('c.type', '=', ConversationTypeEnum::PRIVATE ->value)
            ->where('sender_id', '=', Auth::id())
            ->Where('receiver_id', '=', $otherUser->id)
            ->orWhere('sender_id', '=', $otherUser->id)
            ->where('receiver_id', '=', Auth::id())
            ->leftJoin('conversations as c', 'messages.conversation_id', '=', 'c.id')
            ->latest()
            ->paginate(10);
    }

    public function scopeForGroup(Builder $query, Group $group)
    {
        return $query->select(['messages.*', 'c.group_id'])
            ->where('c.type', '=', ConversationTypeEnum::GROUP->value)
            ->where('c.group_id', '=', $group->id)
            ->leftJoin('conversations as c', 'messages.conversation_id', '=', 'c.id')
            ->latest()
            ->paginate(10);
    }

    public function scopeOlder(Builder $query, Message $message)
    {
        return $query->where('created_at', '<', $message->created_at)
            ->where('conversation_id', '=', $message->conversation->id)
            ->latest()
            ->paginate(10);
    }
}
