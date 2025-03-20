<?php

use App\Models\Task;
use App\Models\User;
use App\Models\TimeEntry;
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
        $this->get('/time-entries')->assertOk();
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
        $timeEntry = TimeEntry::factory()->create([
            'user_id' => $this->user->id,
        ]);

        $endTime = now()->toDateTimeString();

        $this->json('PUT', "/time-entries/{$timeEntry->id}", [
            'end_time' => $endTime,
        ]);

        $this->assertDatabaseHas('time_entries', [
            'id' => $timeEntry->id,
            'end_time' => $endTime,
        ]);
    });
});
