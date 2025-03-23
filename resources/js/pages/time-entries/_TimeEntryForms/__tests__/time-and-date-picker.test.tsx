import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, test } from 'vitest';

import { TimeAndDatePicker } from '@/pages/time-entries/_TimeEntryForms/time-and-date-picker';
import { TimeEntryProvider } from '@/pages/time-entries/_TimeEntryForms/time-entry-form-context';

test('should not show error borders if both times have not been set', async () => {
    render(
        <TimeEntryProvider>
            <TimeAndDatePicker />
        </TimeEntryProvider>,
    );
    const inputElements = document.querySelectorAll('[data-slot="input"]');
    const startTimeInput = inputElements[0];
    const endTimeInput = inputElements[1];

    await userEvent.type(startTimeInput, '09:09');

    expect(startTimeInput).toHaveValue('09:09:00');
    expect(startTimeInput).not.toHaveClass('border-destructive');
    expect(endTimeInput).not.toHaveClass('border-destructive');
});

test('should not show error border when times are within range', async () => {
    render(
        <TimeEntryProvider>
            <TimeAndDatePicker />
        </TimeEntryProvider>,
    );
    const inputElements = document.querySelectorAll('[data-slot="input"]');
    const startTimeInput = inputElements[0];
    const endTimeInput = inputElements[1];

    // TODO: figure out why the value always ends up at XX:59:00 after 09:09
    // https://github.com/testing-library/user-event/pull/502
    await userEvent.type(startTimeInput, '09:09');
    await userEvent.type(endTimeInput, '10:10');

    expect(startTimeInput).toHaveValue('09:09:00');
    expect(endTimeInput).toHaveValue('10:59:00');
    expect(startTimeInput).not.toHaveClass('border-destructive');
    expect(endTimeInput).not.toHaveClass('border-destructive');
});

test('should display error border when end_time < start_time', async () => {
    render(
        <TimeEntryProvider>
            <TimeAndDatePicker />
        </TimeEntryProvider>,
    );
    const inputElements = document.querySelectorAll('[data-slot="input"]');
    const startTimeInput = inputElements[0];
    const endTimeInput = inputElements[1];

    await userEvent.type(startTimeInput, '09:00');
    await userEvent.type(endTimeInput, '08:00');

    expect(startTimeInput).toHaveClass('border-destructive');
    expect(endTimeInput).toHaveClass('border-destructive');
});
