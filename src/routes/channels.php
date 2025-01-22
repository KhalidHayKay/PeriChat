<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('online', function (User $user) {
    return $user ? new UserResource($user) : null;
});

Broadcast::channel(
    'message.private.{user1_id}-{user2-id}',
    function (User $user, int $user1ID, int $user2Id) {
        return $user->id === $user1ID || $user->id === $user2Id ? $user : null;
    }
);

Broadcast::channel(
    'message.private.group.{groupId}',
    function (User $user, int $groupId) {
        return $user->groups->contains('id', $groupId) ? $user : null;
    }
);
