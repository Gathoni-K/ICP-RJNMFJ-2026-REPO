export interface Grade {
    id: string;
    subject: string;
    score: number;
    created_at?: string;
    student_id?: string;
}

export interface Student {
    id: string;
    name: string;
    created_at?: string;
    grades: Grade[];
}