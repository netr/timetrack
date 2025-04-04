export interface Task {
    id: number;
    user_id: number;
    category_id: number;
    category?: Category;
    title: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
}

export type TimeEntry = {
    id: number;
    task_id: number;
    task: Task;
    start_time: string;
    end_time: string;
    created_at: string;
    updated_at: string;
};
