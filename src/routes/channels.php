<?php

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('online', function (User $user) {
    return $user ? new UserResource($user) : null;
});

Broadcast::channel(
    'message.private.{user1Id}-{user2Id}',
    function (User $user, int $user1Id, int $user2Id) {
        return $user->id === $user1Id || $user->id === $user2Id ? $user : null;
    }
);

Broadcast::channel(
    'message.group.{groupId}',
    function (User $user, int $groupId) {
        return $user->groups->contains('id', $groupId) ? $user : null;
    }
);
