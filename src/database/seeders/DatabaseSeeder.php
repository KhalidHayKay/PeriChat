<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Grammar;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User seed
        User::factory()->create([
            'name'     => 'John Doe',
            'email'    => 'john@example.com',
            'password' => bcrypt('123456'),
            'is_admin' => true,
        ]);

        User::factory()->create([
            'name'     => 'Jane Doe',
            'email'    => 'jane@example.com',
            'password' => bcrypt('123456'),
        ]);

        User::factory(10)->create();

        // Group seed
        for ($i = 0; $i < 5; $i++) {
            /**
             * @var Group
             */
            $group = Group::factory()->create(['owner_id' => 1]);

            $users = User::inRandomOrder()->limit(rand(2, 5))->pluck('id');
            $group->users()->attach(array_unique([1, ...$users]));
        }

        // Message seed
        Message::factory(1000)->create();

        // Conversation seed
        $messages      = Message::whereNull('group_id')->orderBy('created_at')->get();
        $conversations = $messages->groupBy(
            fn (Message $message) => collect([
                $message->sender_id,
                $message->receiver_id,
            ])->sort()->implode('_')
        )
            ->map(fn ($groupedMessages) => [
                'user1_id'        => $groupedMessages->first()->sender_id,
                'user2_id'        => $groupedMessages->first()->receiver_id,
                'last_message_id' => $groupedMessages->last()->id,
                'created_at'      => new Carbon(),
                'updated_at'      => new Carbon(),
            ])->values();

        Conversation::insertOrIgnore($conversations->toArray());
    }
}
