<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    /** @use \Illuminate\Database\Eloquent\SoftDeletes */
    use SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * Get the tasks for the category.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<Task>
     */
    public function tasks(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Task::class);
    }

    /**
     * Get the time entries for the category.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasManyThrough<TimeEntry>
     */
    public function timeEntries(): \Illuminate\Database\Eloquent\Relations\HasManyThrough
    {
        return $this->hasManyThrough(TimeEntry::class, Task::class);
    }
}
