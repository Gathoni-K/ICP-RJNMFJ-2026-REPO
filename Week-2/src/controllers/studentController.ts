import type { Student, Grade } from '../models/types.js';

/*
the imports have a '.js' extension even though it is a ts file 
as we are using ES modules.
*/

//in-memory storage of the student names
let students: Student[] = [];

//function for adding students
export const addStudent = (name: string) => {
    //the function takes the name as an input
    const student = {
        id: crypto.randomUUID(),
        name: name,
        grades: [],
    }
    //create a student object with an id, name and grades
    students.push(student);
    //adding our new student to the OG students array

    return student;
    //return the new student
}

//function for fetching the students data
export const getAllStudents = (): Student[] => {
    //sets our return type to the entire students array
    return students;
}

//function for getting the students by ID.
export const getStudentsById = (id: string): Student | undefined => {
    const found = students.find((student) => student.id === id);
    return found;
}

export const addStudentGrade = (id: string, subject: string, score: number ): Student | null => {
    const student = getStudentsById(id);
    //the student object will contain the student if found and undefined if the student does not exist
    if(!student){
        return null;
    }
    //if the student is not found, we will return null

    const newGrade: Grade = {
        id: crypto.randomUUID(),
        subject: subject,
        score: score,
    }
    //creating a grade object

    student.grades.push(newGrade);
    //add the grade to the student's grade array

    return student;
}

export const calculateAverage = (id: string): number | null => {
    const student = getStudentsById(id);

    if(!student){
        return null;
    }
    if(student.grades.length === 0){
        return null;
    }
    //if the grades array is empty then we return null

    const total = student.grades.reduce((sum, grade) => sum + grade.score, 0);

    const average = total / student.grades.length;

    return average;
}
