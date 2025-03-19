import { Head } from '@inertiajs/react';

import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Time Entries',
        href: '/time-entries',
    },
];

export default function TimeEntries() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Time Entries" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">hey</div>
        </AppLayout>
    );
}
