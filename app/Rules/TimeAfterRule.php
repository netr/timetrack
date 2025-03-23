<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Carbon;

class TimeAfterRule implements ValidationRule
{
    public function __construct(protected $startTime = null) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        try {
            $startTime = Carbon::createFromFormat('H:i:s', $this->startTime);
            $endTime = Carbon::createFromFormat('H:i:s', $value);

            if ($startTime?->lt($endTime)) {
                return;
            }

            $fail('The :attribute must be after start time.');
        } catch (\Exception $e) {
            $fail('The :attribute must be after start time.');
        }
    }
}
