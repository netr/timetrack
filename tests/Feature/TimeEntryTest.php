<?php

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

    it('can create a time entry without end time', function () {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $startTime = now()->subHours(1)->toDateTimeString();

        $this->json('POST', '/time-entries', [
            'task_id' => $task->id,
            'start_time' => $startTime,
        ]);

        $this->assertDatabaseHas('time_entries', [
            'user_id' => $this->user->id,
            'task_id' => $task->id,
            'start_time' => $startTime,
            'end_time' => null,
        ]);
    });

    it('can create a time entry with end time', function () {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $startTime = now()->subHours(1)->toDateTimeString();
        $endTime = now()->toDateTimeString();

        $this->json('POST', '/time-entries', [
            'task_id' => $task->id,
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);

        $this->assertDatabaseHas('time_entries', [
            'user_id' => $this->user->id,
            'task_id' => $task->id,
            'start_time' => $startTime,
            'end_time' => $endTime,
        ]);
    });

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

    it('user can only update their own time entries', function () {
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

    it('can delete a time entry', function () {
        $task = Task::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $timeEntry = TimeEntry::factory()->for($task)->create();

        $this->json('DELETE', "/time-entries/{$timeEntry->id}");

        $this->assertDatabaseMissing('time_entries', [
            'id' => $timeEntry->id,
        ]);
    });

    it('user can only delete their own time entries', function () {
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
