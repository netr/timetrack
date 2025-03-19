<?php

namespace Database\Factories;

use App\Models\Task;
use App\Models\TimeEntry;
use Illuminate\Database\Eloquent\Factories\Factory;

class TimeEntryFactory extends Factory
{
    protected $model = TimeEntry::class;

    public function definition(): array
    {
        return [
            'task_id' => Task::factory(),
            'start_time' => fake()->dateTimeBetween('-1 month', 'now'),
            'end_time' => fake()->dateTimeBetween('start_time', '+4 hours'),
        ];
    }

    public function configure(): TimeEntryFactory
    {
        return $this->afterMaking(function (TimeEntry $entry) {
            $entry->user_id = $entry->task->user_id;
        });
    }
}
