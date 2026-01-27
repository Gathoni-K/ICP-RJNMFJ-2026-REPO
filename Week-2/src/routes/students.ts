import express from "express";
import {
    addStudent,
    getAllStudents,
    getStudentsById,
    addStudentGrade,
    calculateAverage,
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