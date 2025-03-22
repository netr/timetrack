<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTimeEntryRequest;
use App\Models\Task;
use App\Models\TimeEntry;
use DB;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Log;

class TimeEntryController extends Controller
{
    public function index(): \Inertia\Response
    {
        $timeEntries = TimeEntry::where('user_id', auth()->user()->id)
            ->with('task', 'task.category')
            ->orderBy('start_time', 'desc')
            ->get();

        return inertia('time-entries/index',
            [
                'timeEntries' => $timeEntries,
            ]);
    }

    public function store(StoreTimeEntryRequest $request): \Illuminate\Http\RedirectResponse
    {
        $validated = $request->validated();

        try {
            return DB::transaction(static function () use ($request, $validated) {
                $userId = auth()->id();

                // Create or find task
                if (! $request->safe()->has('task_id')) {
                    $task = Task::create([
                        'user_id' => $userId,
                        'category_id' => $validated['category_id'],
                        'title' => $validated['task_title'],
                    ]);
                } else {
                    $task = Task::findOrFail($validated['task_id']);
                }

                // Combine date and time
                $startTime = "{$validated['date']} {$validated['start_time']}";
                $endTime = ! $request->safe()->isNotFilled('end_time')
                    ? "{$validated['date']} {$validated['end_time']}"
                    : null;

                // Create time entry using relationship
                $task->timeEntries()->create([
                    'user_id' => $userId,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                ]);

                Log::info('Time entry created', [
                    'user_id' => $userId,
                    'task_id' => $task->id,
                    'start_time' => $startTime,
                    'end_time' => $endTime,
                ]);

                return to_route('time-entries.index')
                    ->with('message', 'Time entry added successfully')
                    ->with('message-type', 'success');
            });
        } catch (\Exception $e) {
            Log::error($e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return to_route('time-entries.index')
                ->with('message', 'An unexpected error occurred')
                ->with('message-type', 'destructive');
        } catch (\Throwable $e) {
            Log::error($e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            return to_route('time-entries.index')
                ->with('message', 'An unexpected error occurred')
                ->with('message-type', 'destructive');
        }
    }

    public function update(Request $request, TimeEntry $timeEntry): JsonResponse
    {
        if ($request->user()->cannot('update', $timeEntry)) {
            return response()->json(['message' => 'You are not authorized to update this time entry'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'end_time' => 'date',
        ]);

        $timeEntry->update([
            'end_time' => $request->end_time,
        ]);

        $timeEntry->task()->update([
            'title' => $request->title,
            'category_id' => $request->category_id,
        ]);

        return response()->json(['message' => 'Time entry updated successfully'], 200);
    }

    public function destroy(Request $request, TimeEntry $timeEntry): \Illuminate\Http\RedirectResponse
    {
        if ($request->user()->cannot('delete', $timeEntry)) {
            Log::info('User not allowed to delete time entry', [
                'user_id' => auth()->id(),
                'time_entry_user_id' => $timeEntry->user_id,
                'time_entry_id' => $timeEntry->id,
            ]);

            return to_route('time-entries.index')
                ->with('message', 'You are not authorized to delete this time entry')
                ->with('message-type', 'destructive');
        }

        $timeEntry->delete();

        Log::info('Time entry deleted', [
            'user_id' => auth()->id(),
            'time_entry_id' => $timeEntry->id,
        ]);

        return to_route('time-entries.index')
            ->with('message', 'Time entry deleted successfully')
            ->with('message-type', 'success');
    }
}
