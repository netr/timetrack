<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class TimeEntryController extends Controller
{
    public function index()
    {
        return Inertia::render('time-entries/index');
    }
}
