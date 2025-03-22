<?php

namespace App\Http\Controllers;

use App\Models\TimeEntry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TimeEntryController extends Controller
{
    public function index(): \Inertia\Response
    {
        $timeEntries = TimeEntry::where('user_id', auth()->user()->id)
            ->with('task')
            ->orderBy('start_time', 'desc')
            ->get();

        return inertia('time-entries/index',
            [
                'timeEntries' => $timeEntries,
            ]);
    }

    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date',
        ]);

        try {
            TimeEntry::create([
                'user_id' => auth()->user()->id,
                'task_id' => $request->task_id,
                'start_time' => $request->start_time,
                'end_time' => $request->end_time,
            ]);
        } catch (\Exception $e) {
            return to_route('users.index', [
                'message' => 'An error occurred while creating the time entry',
                'message-type' => 'destructive',
            ]);
        }

        return to_route('users.index', [
            'message' => 'Time entry created successfully',
            'message-type' => 'default',
        ]);
    }

    public function update(Request $request, TimeEntry $timeEntry): JsonResponse
    {
        if ($request->user()->cannot('update', $timeEntry)) {
            return response()->json(['message' => 'You are not authorized to update this time entry'], 403);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'end_time' => 'date',
        ]);

        $timeEntry->update([
            'end_time' => $request->end_time,
        ]);

        $timeEntry->task()->update([
            'title' => $request->title,
            'description' => $request->description,
            'category_id' => $request->category_id,
        ]);

        return response()->json(['message' => 'Time entry updated successfully'], 200);
    }

    public function destroy(Request $request, TimeEntry $timeEntry): JsonResponse
    {
        if ($request->user()->cannot('delete', $timeEntry)) {
            return response()->json(['message' => 'You are not authorized to delete this time entry'], 403);
        }

        $timeEntry->delete();

        return response()->json(['message' => 'Time entry deleted successfully']);
    }
}
