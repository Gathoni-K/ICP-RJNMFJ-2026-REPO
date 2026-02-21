import express from "express";
import {
    addStudent,
    getAllStudents,
    getStudentsById,
    addStudentGrade,
    calculateAverage,
    deleteStudent,
} from "../contollers/studentController";
import {
    addStudentSchema,
    addGradeSchema,
    getStudentSchema,
    deleteStudentSchema,
} from "../validators/studentValidator";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

// Route for getting all students
router.get('/', async (req, res) => {
    router.use(authMiddleware);
    try {
        const students = await getAllStudents();
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for getting one student by their ID
router.get('/:id', async (req, res) => {
    router.use(authMiddleware);
    const result = getStudentSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({
            message: 'Invalid input',
            errors: result.error.issues
        });
    }

    try {
        const data = await getStudentsById(result.data.id);

        if (!data) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for adding a student
router.post('/', async (req, res) => {
    router.use(authMiddleware);
    const result = addStudentSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: 'Invalid input',
            errors: result.error.issues
        });
    }

    try {
        const newStudent = await addStudent(result.data.name);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for adding a grade to a specific student
router.post('/:id/grades', async (req, res) => {
    router.use(authMiddleware);
    const result = addGradeSchema.safeParse({
        ...req.params,
        ...req.body
    });

    if (!result.success) {
        return res.status(400).json({
            message: 'Invalid input',
            errors: result.error.issues
        });
    }

    try {
        const { id, subject, score } = result.data;
        const student = await addStudentGrade(id, subject, score);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for calculating the student's average
router.get('/:id/average', async (req, res) => {
    router.use(authMiddleware);
    const result = getStudentSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({
            message: 'Invalid input',
            errors: result.error.issues
        });
    }

    try {
        const average = await calculateAverage(result.data.id);

        if (average === null) {
            return res.status(404).json({ error: 'Student not found or has no grades' });
        }

        res.json({ average });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route for deleting a student
router.delete('/:id', async (req, res) => {
    router.use(authMiddleware);
    const result = deleteStudentSchema.safeParse(req.params);

    if (!result.success) {
        return res.status(400).json({
            message: 'Invalid input',
            errors: result.error.issues
        });
    }

    try {
        const deleted = await deleteStudent(result.data.id);

        if (!deleted) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;