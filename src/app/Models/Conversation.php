<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Reverb\Pulse\Livewire\Messages;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'group_id',
        'last_message_id',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_conversation');
    }

    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Messages::class);
    }

    public function lastMessage(): BelongsTo
    {
        return $this->belongsTo(Message::class, 'last_message_id');
    }

    public static function getConversationSubjects(User $user)
    {
        $users  = User::getUsersExceptUser($user);
        $groups = Group::getUserGroups($user);

        return $users->map(
            fn (User $user) => $user->toConversationArray()
        )->concat(
                $groups->map(fn (Group $group) => $group->toConversationArray())
            );
    }
}
