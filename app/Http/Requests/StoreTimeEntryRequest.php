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
        return [
            'task_id' => 'nullable|exists:tasks,id',
            'task_title' => 'required_without:task_id|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'date' => 'required|date',
            'start_time' => ['required', Rule::date()->format('H:i')],
            'end_time' => ['nullable', Rule::date()->format('H:i')],
        ];
    }
}
