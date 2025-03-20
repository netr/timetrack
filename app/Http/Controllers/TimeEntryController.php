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
}
