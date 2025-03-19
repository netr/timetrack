import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import AppLayout from '@/layouts/app-layout';

export default function TimeEntries() {
    return (
        <AppLayout>
            <Head title="Time Entries" />

            <div className="flex flex-col gap-4">
                <HeadingSmall description="View your time entries" title="Time Entries" />
            </div>
        </AppLayout>
    );
}
