<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTimeEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'task_title' => 'required|string|max:255',
            'category_id' => 'nullable|exists:categories,id',
            'end_time' => ['required', 'date'],
        ];
    }
}
