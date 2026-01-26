export interface Grade{
    id: string;
    subject: string;
    score: number;
}

export interface Student{
    id: string;
    name: string;
    grades: Grade[];
}