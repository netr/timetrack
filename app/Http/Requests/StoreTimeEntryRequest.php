<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTimeEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isManualMode = $this->request->get('mode') === 'manual';

        return [
            'mode' => 'required|in:timer,manual',
            'task_id' => 'nullable|exists:tasks,id',
            'task_title' => 'required_without:task_id|string|min:3,max:255',
            'category_id' => 'nullable|exists:categories,id',
            'date' => 'required|date',
            'start_time' => ['required', Rule::date()->format('H:i')],
            'end_time' => [
                Rule::when(
                    $isManualMode,
                    ['required', Rule::date()->format('H:i')],
                    ['prohibited']
                ),
            ],
        ];
    }
}
