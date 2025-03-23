<?php

use App\Models\Category;
use App\Models\Task;
use App\Models\TimeEntry;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('guests are redirected to the login page', function () {
    $this->get('/time-entries')->assertRedirect('/login');
});

describe('authenticated users', function () {
    beforeEach(function () {
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    });

    it('returns the users time entries correctly', function () {
        Task::factory()
            ->count(5)
            ->has(TimeEntry::factory())
            ->create([
                'user_id' => $this->user->id,
            ]);

        $this->get('/time-entries')
            ->assertOk()
            ->assertInertia(fn ($assert) => $assert
                ->component('time-entries/index')
                ->has('timeEntries', 5)
            );
    });

    it('should create a task when no task_id is set', function () {
        $category = Category::factory()->create();

        $startTime = now()->subHours(1)->format('H:i');
        $date = now()->toDateString();

        $this->json('POST', '/time-entries', [
            'mode' => 'timer',
            'task_title' => 'random title',
            'category_id' => $category->id,
            'start_time' => $startTime,
            'end_time' => null,
            'date' => $date,
        ])
            ->assertRedirectToRoute('time-entries.index')
            ->assertSessionHas('message-type', 'success');

        $this->assertDatabaseHas('tasks', [
            'user_id' => $this->user->id,
            'category_id' => $category->id,
        ]);

        $this->assertDatabaseHas('time_entries', [
            'user_id' => $this->user->id,
            'task_id' => 1,
            'start_time' => $date.' '.$startTime,
            'end_time' => null,
        ]);
    });

    describe('when creating in timer mode', function () {
        it('allows null end_time', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $startTime = now()->subHours(1)->format('H:i');
            $date = now()->toDateString();

            $this->json('POST', '/time-entries', [
                'mode' => 'timer',
                'task_id' => $task->id,
                'category_id' => $task->category_id,
                'start_time' => $startTime,
                'end_time' => null,
                'date' => $date,
            ])
                ->assertRedirectToRoute('time-entries.index')
                ->assertSessionHas('message-type', 'success');

            $this->assertDatabaseHas('time_entries', [
                'user_id' => $this->user->id,
                'task_id' => $task->id,
                'start_time' => $date.' '.$startTime,
                'end_time' => null,
            ]);
        });

        it('should fail when end_time is set', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $startTime = now()->subHours(1)->format('H:i');
            $date = now()->toDateString();
            $endTime = now()->format('H:i');

            $this->json('POST', '/time-entries', [
                'mode' => 'timer',
                'task_id' => $task->id,
                'category_id' => $task->category_id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'date' => $date,
            ])
                ->assertJsonValidationErrors('end_time');
        });
    });

    describe('when creating in manual mode', function () {
        it('allows end_time to be set', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $date = now()->toDateString();
            $startTime = now()->subHours(1)->format('H:i');
            $endTime = now()->format('H:i');

            $this->json('POST', '/time-entries', [
                'mode' => 'manual',
                'task_id' => $task->id,
                'category_id' => $task->category_id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'date' => $date,
            ])
                ->assertRedirectToRoute('time-entries.index')
                ->assertSessionHas('message-type', 'success');

            $this->assertDatabaseHas('time_entries', [
                'user_id' => $this->user->id,
                'task_id' => $task->id,
                'start_time' => $date.' '.$startTime,
                'end_time' => $date.' '.$endTime,
            ]);
        });

        it('should fail with a missing end_time', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $date = now()->toDateString();
            $startTime = now()->subHours(1)->format('H:i');
            $endTime = now()->format('H:i');

            // This will fail because end_time is required
            $this->json('POST', '/time-entries', [
                'mode' => 'manual',
                'task_id' => $task->id,
                'category_id' => $task->category_id,
                'start_time' => $startTime,
                'end_time' => null,
                'date' => $date,
            ])
                ->assertJsonValidationErrors('end_time');
        });

        it('should fail when end_time < start_time', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $date = now()->toDateString();
            $startTime = now()->startOfDay()->addHour()->format('H:i');
            $endTime = now()->startOfDay()->format('H:i');

            // This will fail because end_time is required
            $this->json('POST', '/time-entries', [
                'mode' => 'manual',
                'task_id' => $task->id,
                'category_id' => $task->category_id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'date' => $date,
            ])
                ->dump()
                ->assertJsonValidationErrors('end_time');
        });
    });

    describe('when updating', function () {
        it('should update end_time correctly', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $timeEntry = TimeEntry::factory()->for($task)->create();

            $endTime = now()->toDateTimeString();

            $this->json('PUT', "/time-entries/{$timeEntry->id}", [
                'end_time' => $endTime,
                'task_title' => $task->title,
                'category_id' => $task->category_id,
            ]);

            $this->assertDatabaseHas('time_entries', [
                'id' => $timeEntry->id,
                'end_time' => $endTime,
            ]);
        });

        it('should update task information correctly', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $timeEntry = TimeEntry::factory()->for($task)->create();

            $endTime = now()->toDateTimeString();

            $this->json('PUT', "/time-entries/{$timeEntry->id}", [
                'end_time' => $endTime,
                'task_title' => 'Test',
                'category_id' => $task->category_id,
            ]);

            $this->assertDatabaseHas('tasks', [
                'id' => $task->id,
                'title' => 'Test',
                'category_id' => $task->category_id,
            ]);
        });

        it('blocks users from updating other users time entries', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $timeEntry = TimeEntry::factory()->for($task)->create();

            $anotherUser = User::factory()->create();

            $this->actingAs($anotherUser);

            $this->json('PUT', "/time-entries/{$timeEntry->id}", [
                'end_time' => now()->toDateTimeString(),
            ])->assertStatus(403);

            $this->assertDatabaseMissing('time_entries', [
                'id' => $timeEntry->id,
                'end_time' => now()->toDateTimeString(),
            ]);
        });
    });

    describe('when deleting', function () {
        it('allows users to delete their own entries', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $timeEntry = TimeEntry::factory()->for($task)->create();

            $this->json('DELETE', "/time-entries/{$timeEntry->id}");

            $this->assertDatabaseMissing('time_entries', [
                'id' => $timeEntry->id,
            ]);
        });

        it('blocks users from deleting other users entries', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $timeEntry = TimeEntry::factory()->for($task)->create();

            $anotherUser = User::factory()->create();

            $this->actingAs($anotherUser);

            $this->json('DELETE', "/time-entries/{$timeEntry->id}")
                ->assertRedirectToRoute('time-entries.index')
                ->assertSessionHas('message-type', 'destructive');

            $this->assertDatabaseHas('time_entries', [
                'id' => $timeEntry->id,
            ]);
        });
    });
});
