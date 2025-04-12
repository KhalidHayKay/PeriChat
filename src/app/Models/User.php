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

    // public static function getUsersExceptUser(User $user): Collection
    // {
    //     $query = self::select(['users.*', 'messages.message as last_message', 'messages.created_at as last_message_date'])
    //         ->where('users.id', '!=', $user->id)
    //         ->when(! $user->is_admin, function (Builder $q) {
    //             $q->whereNull('users.blocked_at');
    //         })
    //         ->leftJoin('conversations', function (JoinClause $join) use ($user) {
    //             $join->on('conversations.user1_id', '=', 'users.id')
    //                 ->where('conversations.user2_id', '=', $user->id)
    //                 ->orWhere(function (JoinClause $join) use ($user) {
    //                     $join->on('conversations.user2_id', '=', 'users.id')
    //                         ->where('conversations.user1_id', '=', $user->id);
    //                 });
    //         })
    //         ->leftJoin('messages', 'messages.id', '=', 'conversations.last_message_id')
    //         ->orderByRaw('IFNULL(users.blocked_at, 1)')
    //         ->orderBy('messages.created_at', 'desc')
    //         ->orderBy('users.name')
    //     ;

    //     // dd($query->toSql());
    //     return $query->get();
    // }

    public static function getUsersExceptUser(User $user): Collection
    {
        $query = User::select([
            'users.*',
            'c.id as c_id',
            'm.created_at as last_message_date',
            'm.sender_id as last_message_sender',
            'm.message as last_message',
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

        // dd($query->toSql());

        return $query->get();
    }

    public function getUnreadCount()
    {
        $query = DB::table('user_conversation')
            ->select('unread_messages_count')
            ->where('conversation_id', $this->c_id)
            ->where('user_id', Auth::id())
        ;

        return $query->first()?->unread_messages_count;
    }

    public function toConversationArray(): array
    {
        return [
            'id'                  => $this->id,
            'name'                => $this->name,
            'avatar'              => $this->avatar,
            'type'                => ConversationTypeEnum::PRIVATE ->value,
            'lastMessage'         => $this->last_message,
            'lastMessageSenderId' => $this->last_message_sender,
            'lastMessageDate'     => $this->last_message_date ? Carbon::parse($this->last_message_date)->setTimezone('UTC')->toIso8601String() : null,
            'unreadMessageCount'  => $this->getUnreadCount(),
        ];
    }
}
