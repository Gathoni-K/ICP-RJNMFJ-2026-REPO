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
})