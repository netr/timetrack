<?php

namespace App\Http\Controllers;

use App\Models\TimeEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimeEntryController extends Controller
{
    public function index()
    {
        return Inertia::render('time-entries/index');
    }

    public function store(Request $request)
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
            return redirect()->back()->with('error', 'Time entry creation failed');
        }

        return redirect()->back()->with('success', 'Time entry created successfully');
    }

    public function update(Request $request, TimeEntry $timeEntry)
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

        return redirect()->back()->with('success', 'Time entry updated successfully');
    }
}
