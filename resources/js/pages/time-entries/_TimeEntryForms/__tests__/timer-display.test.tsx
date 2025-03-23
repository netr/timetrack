import { act, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { formatDuration, TimerDisplay } from '../timer-display'; // Update path if needed

describe('TimerDisplay', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(2025, 1, 1, 0, 0, 0));
    });

    afterEach(() => {
        // Clean up timers after each test
        vi.restoreAllMocks();
    });

    it('renders 00:00:00 when not running', () => {
        render(<TimerDisplay isRunning={false} startTime={null} />);
        expect(screen.getByText('00:00:00')).toBeInTheDocument();
    });

    it('renders correct initial time when started', () => {
        const startTime = Date.now() - 5000;
        render(<TimerDisplay isRunning startTime={startTime} />);
        expect(screen.getByText('00:00:05')).toBeInTheDocument();
    });

    it('updates time every second when running', async () => {
        const startTime = Date.now() - 10000;
        render(<TimerDisplay isRunning startTime={startTime} />);

        expect(screen.getByText('00:00:10')).toBeInTheDocument();
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getByText('00:00:11')).toBeInTheDocument();
        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(screen.getByText('00:00:12')).toBeInTheDocument();
    });

    it('stays at 00:00:00 when not running even if startTime is set', () => {
        const startTime = Date.now() - 30000;
        render(<TimerDisplay isRunning={false} startTime={startTime} />);

        expect(screen.getByText('00:00:00')).toBeInTheDocument();
        act(() => {
            vi.advanceTimersByTime(5000);
        });
        expect(screen.getByText('00:00:00')).toBeInTheDocument();
    });

    it('stops updating when isRunning changes to false', () => {
        const startTime = Date.now() - 5000;
        const { rerender } = render(<TimerDisplay isRunning startTime={startTime} />);
        expect(screen.getByText('00:00:05')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(2000);
        });
        expect(screen.getByText('00:00:07')).toBeInTheDocument();

        // Change to not running
        rerender(<TimerDisplay isRunning={false} startTime={startTime} />);
        // Should reset to 00:00:00
        expect(screen.getByText('00:00:00')).toBeInTheDocument();
        act(() => {
            vi.advanceTimersByTime(3000);
        });
        // Should still show 00:00:00
        expect(screen.getByText('00:00:00')).toBeInTheDocument();
    });

    it('applies custom className correctly', () => {
        const customClass = 'text-red-500 text-2xl';
        render(<TimerDisplay className={customClass} isRunning={false} startTime={null} />);

        const timerElement = screen.getByText('00:00:00');
        expect(timerElement).toHaveClass('text-center', 'font-mono', 'text-red-500', 'text-2xl');
    });
});

// Test the standalone formatDuration function
describe('formatDuration', () => {
    it('formats seconds correctly', () => {
        expect(formatDuration(15000)).toBe('00:00:15');
    });

    it('formats minutes correctly', () => {
        expect(formatDuration(125000)).toBe('00:02:05');
    });

    it('formats hours correctly', () => {
        expect(formatDuration(7225000)).toBe('02:00:25');
    });

    it('formats > 1 day correctly', () => {
        let seconds = 86400; // 1 day
        seconds += 3600 * 3; // 3 hours
        seconds += 60 * 4; // 4 minutes
        seconds += 20; // 20 seconds
        expect(formatDuration(seconds * 1000)).toBe('27:04:20');
    });

    it('handles zero correctly', () => {
        expect(formatDuration(0)).toBe('00:00:00');
    });
});
