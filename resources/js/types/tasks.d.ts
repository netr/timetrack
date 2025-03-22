export interface Task {
    id: number;
    user_id: number;
    title: string;
    created_at: string;
    updated_at: string;
}

export type TimeEntry = {
    id: number;
    task_id: number;
    task: Task;
    start_time: string;
    end_time: string;
};
