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

    it('can visit the time entries page', function () {
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

    describe('when creating', function () {
        it('can create new entries with a predefined task, without an end time', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $startTime = now()->subHours(1)->format('H:i');
            $date = now()->toDateString();

            $this->json('POST', '/time-entries', [
                'task_id' => $task->id,
                'category_id' => $task->category_id,
                'start_time' => $startTime,
                'date' => $date,
            ])->assertRedirectToRoute('time-entries.index', [
                'message' => 'Time entry created successfully',
                'message-type' => 'default',
            ]);

            $this->assertDatabaseHas('time_entries', [
                'user_id' => $this->user->id,
                'task_id' => $task->id,
                'start_time' => $date.' '.$startTime,
                'end_time' => null,
            ]);
        });

        it('can create new entries with a predefined task, with an end time', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $date = now()->toDateString();
            $startTime = now()->subHours(1)->format('H:i');
            $endTime = now()->format('H:i');

            $this->json('POST', '/time-entries', [
                'task_id' => $task->id,
                'category_id' => $task->category_id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'date' => $date,
            ])->assertRedirectToRoute('time-entries.index', [
                'message' => 'Time entry created successfully',
                'message-type' => 'default',
            ]);

            $this->assertDatabaseHas('time_entries', [
                'user_id' => $this->user->id,
                'task_id' => $task->id,
                'start_time' => $date.' '.$startTime,
                'end_time' => $date.' '.$endTime,
            ]);
        });

        it('can create new entries without a predefined task', function () {
            $category = Category::factory()->create();

            $startTime = now()->subHours(1)->format('H:i');
            $date = now()->toDateString();

            $this->json('POST', '/time-entries', [
                'task_title' => 'random title',
                'category_id' => $category->id,
                'start_time' => $startTime,
                'date' => $date,
            ])->assertRedirectToRoute('time-entries.index', [
                'message' => 'Time entry created successfully',
                'message-type' => 'default',
            ]);

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
    });

    describe('when updating', function () {
        it('can update an end time', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $timeEntry = TimeEntry::factory()->for($task)->create();

            $endTime = now()->toDateTimeString();

            $this->json('PUT', "/time-entries/{$timeEntry->id}", [
                'end_time' => $endTime,
                'title' => 'Test',
                'description' => 'Test',
                'category_id' => $task->category_id,
            ]);

            $this->assertDatabaseHas('time_entries', [
                'id' => $timeEntry->id,
                'end_time' => $endTime,
            ]);

            $this->assertDatabaseHas('tasks', [
                'id' => $task->id,
                'title' => 'Test',
                'description' => 'Test',
                'category_id' => $task->category_id,
            ]);
        });

        it('can not update other users entries', function () {
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
        it('can delete their own entries', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $timeEntry = TimeEntry::factory()->for($task)->create();

            $this->json('DELETE', "/time-entries/{$timeEntry->id}");

            $this->assertDatabaseMissing('time_entries', [
                'id' => $timeEntry->id,
            ]);
        });

        it('can not delete other users entries', function () {
            $task = Task::factory()->create([
                'user_id' => $this->user->id,
            ]);

            $timeEntry = TimeEntry::factory()->for($task)->create();

            $anotherUser = User::factory()->create();

            $this->actingAs($anotherUser);

            $this->json('DELETE', "/time-entries/{$timeEntry->id}")->assertStatus(403);

            $this->assertDatabaseHas('time_entries', [
                'id' => $timeEntry->id,
            ]);
        });
    });
});
