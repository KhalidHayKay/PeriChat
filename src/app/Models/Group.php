<?php

namespace App\Models;

use App\Enums\ConversationTypeEnum;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Group extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'avatar',
        'is_private',
        'owner_id',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function conversation(): HasOne
    {
        return $this->hasOne(Conversation::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function getUserGroups(User $user): Collection
    {
        $query = self::select([
            'groups.*',
            'c.id as c_id',
            'm.message as last_message',
            'm.sender_id as last_message_sender',
            'm.created_at as last_message_date',
        ])
            ->leftJoin('group_user as gu', 'gu.group_id', '=', 'groups.id')
            ->leftJoin('conversations as c', 'c.group_id', '=', 'groups.id')
            ->leftJoin('messages as m', 'm.id', '=', 'c.last_message_id')
            ->where(function ($query) use ($user) {
                $query->where('gu.user_id', '=', $user->id)
                    // ->orWhere('groups.is_private', '!=', true)
                ;
            })
            ->distinct()
            ->orderBy('m.created_at', 'desc')
            ->orderBy('groups.name');

        return $query->get();
    }

    public function getUnreadCount()
    {
        $query = DB::table('group_user')
            ->select('unread_messages_count')
            ->where('group_id', $this->id)
            ->where('user_id', Auth::id())
        ;

        // dd($query->first());

        return $query->first()?->unread_messages_count;
    }

    public function toConversationArray(?int $conversationId = null): array
    {
        return [
            'id'                  => $this->c_id ?? $conversationId,
            'name'                => $this->name,
            'avatar'              => $this->avatar,
            'type'                => ConversationTypeEnum::GROUP->value,
            'typeId'              => $this->id,
            'groupUserIds'        => $this->users()->pluck('users.id'),
            'lastMessage'         => $this->last_message,
            'lastMessageSenderId' => $this->last_message_sender,
            'lastMessageDate'     => $this->last_message_date ? Carbon::parse($this->last_message_date)->setTimezone('UTC')->toIso8601String() : null,
            'unreadMessageCount'  => $this->getUnreadCount(),
        ];
    }
}
