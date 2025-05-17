<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use App\Enums\ConversationTypeEnum;
use App\DTOs\ConversationSubjectsDTO;
use Illuminate\Database\Eloquent\Model;
use Laravel\Reverb\Pulse\Livewire\Messages;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public static function getExistingSubjects(User $user)
    {
        $users  = User::getUsersExceptUser($user);
        $groups = Group::getUserGroups($user);

        //This unread count bulk fetch is only for "Home" component display of message
        $userUnreadCounts = DB::table('user_conversation')
            ->where('user_id', $user->id)
            ->pluck('unread_messages_count', 'conversation_id'); // [conversation_id => count]

        $groupUnreadCounts = DB::table('group_user')
            ->where('user_id', $user->id)
            ->pluck('unread_messages_count', 'group_id'); // [group_id => count]

        // dd($groupUnreadCounts);

        return collect([...$users, ...$groups])->map(
            fn ($model) => (new ConversationSubjectsDTO(
                $model,
                unreadCounts: $userUnreadCounts->union($groupUnreadCounts)->toArray()
            ))->toArray()
        );
    }

    public static function getNewUserSubjects(User $user)
    {
        $query = User::where('id', '!=', $user->id)
            ->whereNotExists(function ($query) use ($user) {
                $query->select(DB::raw(1))
                    ->from('user_conversation as uc1')
                    ->join('user_conversation as uc2', 'uc2.conversation_id', '=', 'uc1.conversation_id')
                    ->whereRaw('uc1.user_id = users.id')
                    ->where('uc2.user_id', '=', $user->id);
            })
            ->orderBy('name');

        return $query->get();
    }

    public static function getNewGroupSubjects(User $user)
    {
        $query = Group::where('is_private', false)
            ->whereNotExists(function ($query) use ($user) {
                $query->select(DB::raw(1))
                    ->from('group_user')
                    ->where('group_user.group_id', '=', 'groups.id')
                    ->where('group_user.user_id', '=', $user->id);
            })
            ->with('users:id')
            ->orderBy('name');

        return $query->get();
    }

    public static function getUsersForNewGroup(User $user)
    {
        $query = User::where('users.id', '!=', $user->id)
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

    public static function getMessageConversation(
        ConversationTypeEnum $type,
        ?int $groupId = null,
        ?array $participants = null,
    ): self {
        if ($type === ConversationTypeEnum::GROUP) {
            $conversation = self::firstOrCreate(
                [
                    'type'     => $type->value,
                    'group_id' => $groupId,
                ]
            );
        }

        if ($type === ConversationTypeEnum::PRIVATE) {
            $conversation = Conversation::select('conversations.*')
                ->join('user_conversation', 'conversations.id', '=', 'user_conversation.conversation_id')
                ->whereIn('user_conversation.user_id', $participants)
                ->groupBy('conversations.id')
                ->havingRaw('COUNT(DISTINCT user_conversation.user_id) = 2')
                ->first();

            if ($conversation === null) {
                DB::beginTransaction();
                try {
                    $conversation = Conversation::create([
                        'type'       => $type->value,
                        'created_at' => now(),
                    ]);

                    $conversation->users()->attach($participants);

                    DB::commit();
                } catch (\Exception $e) {
                    DB::rollBack();
                    throw $e;
                }
            }
        }

        return $conversation;
    }
}
