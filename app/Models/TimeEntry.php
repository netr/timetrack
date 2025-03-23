<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TimeEntry extends Model
{
    /** @use HasFactory<\Database\Factories\TimeEntryFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'task_id',
        'start_time',
        'end_time',
    ];

    /**
     * Get the user that owns the time entry.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<User>
     */
    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the task that owns the time entry.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Task>
     */
    public function task(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function isAfterStartTime(string|Carbon $time): bool
    {
        $startTime = Carbon::createFromDate($this->start_time);
        if ($time instanceof Carbon) {
            return $startTime->lt($time);
        }

        return $startTime->lt(Carbon::createFromDate($time));
    }
}
