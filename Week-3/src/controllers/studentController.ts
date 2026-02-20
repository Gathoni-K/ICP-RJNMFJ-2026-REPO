import { supabase } from '../config/supabase.js';
import type { Student, Grade } from '../models/types.js';

export const addStudent = async (name: string): Promise<Student> => {
    const { data, error } = await supabase
        .from('students')
        .insert([{ name }])
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
    const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('created_at', { ascending: false });

    if (studentsError) {
        throw new Error(`Failed to fetch students: ${studentsError.message}`);
    }

    const studentsWithGrades = await Promise.all(
        students.map(async (student) => {
            const { data: grades, error: gradesError } = await supabase
                .from('grades')
                .select('*')
                .eq('student_id', student.id);

            if (gradesError) {
                console.error(`Error fetching grades for ${student.name}:`, gradesError);
                return { ...student, grades: [] };
            }

            return {
                ...student,
                grades: grades || []
            };
        })
    );

    return studentsWithGrades;
};

export const getStudentsById = async (id: string): Promise<Student | null> => {
    const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

    if (studentError) {
        if (studentError.code === 'PGRST116') {
            return null;
        }
        throw new Error(`Failed to fetch student: ${studentError.message}`);
    }

    const { data: grades, error: gradesError } = await supabase
        .from('grades')
        .select('*')
        .eq('student_id', id);

    if (gradesError) {
        console.error(`Error fetching grades:`, gradesError);
        return { ...student, grades: [] };
    }

    return {
        ...student,
        grades: grades || []
    };
};

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