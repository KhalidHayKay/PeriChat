<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Enums\ConversationTypeEnum;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'avatar',
        'name',
        'email',
        'email_verified_at',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class);
    }

    public function conversations(): BelongsToMany
    {
        return $this->belongsToMany(Conversation::class, 'user_conversation');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }

    public static function getUsersExceptUser(User $user): Collection
    {
        $query = User::select([
            'users.*',
            'c.id as c_id',
            'm.created_at as last_message_date',
            'm.sender_id as last_message_sender',
            'm.message as last_message',
            DB::raw('(SELECT COUNT(*) FROM message_attachments WHERE message_attachments.message_id = m.id) as last_message_attachment_count'),
        ])
            ->where('users.id', '!=', $user->id)
            ->leftJoin('user_conversation as uc', 'uc.user_id', '=', 'users.id')
            ->leftJoin('conversations as c', 'c.id', '=', 'uc.conversation_id')
            ->leftJoin('messages as m', 'm.id', '=', 'c.last_message_id')
            ->where(function ($query) use ($user) {
                $query->where('m.sender_id', '=', $user->id)
                    ->orWhere('m.receiver_id', '=', $user->id);
            })
            ->orderBy('m.created_at', 'desc')
            ->orderBy('users.name');
        ;

        return $query->get();
    }

    public function getUnreadCount(?int $conversationId)
    {
        if (! $conversationId && ! $this->c_id) {
            return null;
        }

        $query = DB::table('user_conversation')
            ->select('unread_messages_count')
            ->where('conversation_id', $this->c_id ?: $conversationId)
            ->where('user_id', Auth::id())
        ;

        return $query->first()?->unread_messages_count;
    }
}
