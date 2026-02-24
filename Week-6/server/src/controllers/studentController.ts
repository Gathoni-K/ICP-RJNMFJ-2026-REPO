import { supabase } from '../config/supabase.js';
import type { Student } from '../models/types';

export const addStudent = async (name: string): Promise<Student> => {
    //define our return type as a promise resolving to a Student object
    const { data, error } = await supabase
    //supabase always return an object with 2 fields: data or error, the former if the operation was successful.
        .from('students')
        //tells supabase the table we are targeting
        .insert([{ name }])
        //adds a new row
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to add student: ${error.message}`);
    }

    return {
        ...data,
        grades: []
    };
};

export const getAllStudents = async (): Promise<Student[]> => {
    const { data, error } = await supabase
        .from('students')
        .select(`
            *,
            grades (*)
        `)
        .order('created_at', { ascending: false });
        //the single join query ensuring that there is only a single db call.
        // an instance of database query optimization

    if (error) {
        throw new Error(`Failed to fetch students: ${error.message}`);
    }

    return data.map(student => ({
        ...student,
        grades: student.grades || []
    }));
};

export const getStudentsById = async (id: string): Promise<Student | null> => {
    const {data, error } = await supabase
    .from('students')
    .select(`
        *,
        grades (*)
        `)
    .eq('id', id)
    .single();

    if(error){

        if(error.code === "PGRST116"){
            //supabase way of saying 'I looked and I found nothing'
            return null;
        }
        throw new Error(`Failed to fetch students ${error.message}`);
    };

    return {
        ...data,
        grades: data.grades || []
    }
}

export const addStudentGrade = async (id: string, subject: string, score: number): Promise<Student | null> => {
    const student = await getStudentsById(id);
    if (!student) {
        return null;
    }

    const { error: gradeError } = await supabase
        .from('grades')
        .insert([{
            student_id: id,
            subject,
            score
        }]);

    if (gradeError) {
        throw new Error(`Failed to add grade: ${gradeError.message}`);
    }

    const updatedStudent = await getStudentsById(id);
    return updatedStudent;
};

export const calculateAverage = async (id: string): Promise<number | null> => {
    const student = await getStudentsById(id);

    if (!student || student.grades.length === 0) {
        return null;
    }

    const total = student.grades.reduce((sum, grade) => sum + grade.score, 0);
    return total / student.grades.length;
};

export const deleteStudent = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

    if (error) {
        if (error.code === 'PGRST116') {
            return false;
        }
        throw new Error(`Failed to delete student: ${error.message}`);
    }

    return true;
};