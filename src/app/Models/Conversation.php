<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id1',
        'user_id2',
        'last_message_id',
    ];

    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public function user1(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function user2(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function getConversationForSidebar(User $user)
    {
        $users  = User::getUsersExceptUser($user);
        $groups = Group::getUsergroups($user);

        return $users->map(
            fn (User $user) => $user->toConversationArray()
        )->concat(
                $groups->map(fn (Group $group) => $group->toConversationArray())
            );
    }
}
