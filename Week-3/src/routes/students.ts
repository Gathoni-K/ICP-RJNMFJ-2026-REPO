import express from "express";
import {
    addStudent,
    getAllStudents,
    getStudentsById,
    addStudentGrade,
    calculateAverage,
    deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();

// Route for getting all the students
router.get('/', async (req, res) => {
    try {
        const students = await getAllStudents();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for getting one student by their ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await getStudentsById(id);
        
        if (!data) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for adding a student
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        
        if (!name) {
            return res.status(400).json({ error: "Name is required" });
        }
        
        const newStudent = await addStudent(name);
        res.status(201).json(newStudent);  // 201 = Created
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for adding a grade to a specific student
router.post('/:id/grades', async (req, res) => {
    try {
        const id = req.params.id;
        const { subject, score } = req.body;
        
        // Validate input
        if (!subject || score === undefined) {
            return res.status(400).json({ error: "Subject and score are required" });
        }
        
        if (typeof score !== 'number' || score < 0 || score > 100) {
            return res.status(400).json({ error: "Score must be a number between 0 and 100" });
        }
        
        const result = await addStudentGrade(id, subject, score);
        
        if (!result) {
            return res.status(404).json({ error: "Student not found" });
        }
        
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for calculating the student's average
router.get('/:id/average', async (req, res) => {
    try {
        const id = req.params.id;
        const average = await calculateAverage(id);

        if (average === null) {
            return res.status(404).json({ error: "Student not found or has no grades" });
        }

        res.json({ average });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for deleting student
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await deleteStudent(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Student not found" });
        }

        res.json({ message: "Student deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;