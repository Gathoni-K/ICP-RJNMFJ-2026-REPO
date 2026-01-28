import express from "express";
import type { Student } from '../models/types.js';
import {
    addStudent,
    getAllStudents,
    getStudentsById,
    addStudentGrade,
    calculateAverage,
    deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

//route for getting all the students.
router.get('/', (req, res) => {
    const students = getAllStudents();
    res.json(students);
    //json must return some data.
})

//route for getting one student by their ID.
router.get('/:id', (req, res) => {
    const id = req.params.id;
    //gets the ID from the URL.
    const data = getStudentsById(id);
    res.json(data);
})

//route for adding a student
router.post('/', (req,res) => {
    const { name } = req.body;
    //gets data from the request body
    const newStudent = addStudent(name);
    res.json(newStudent);
})

//route for adding a grade to a specific student
router.post('/:id/grades', (req,res)=> {
    const id = req.params.id;
    //get the id from the URL
    const { subject, score } = req.body;
    //get this from the body
    const result = addStudentGrade(id, subject, score);
    res.json(result);
})

//route for calculating the student's average.
router.get('/:id/average', (req, res) => {
    const id = req.params.id;
    //answers which student
    const average = calculateAverage(id);
    //calculates the average

    if(average === null){
        return res.status(404).json({ error : "Student not found or has no grades" });
    }

    res.json({average});
    //sends back the number
});

//route for deleting student
router.delete('/:id', (req,res) => {
    const deleted = deleteStudent(req.params.id);

    if(!deleted) {
        return res.status(404).json({error: "Student not found" });
    }

    res.json({ message: "Student deleted successfully" });
})

export default router;