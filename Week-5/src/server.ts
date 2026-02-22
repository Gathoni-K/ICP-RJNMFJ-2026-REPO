import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import studentRoutes from './routes/students';
import authRoutes from './routes/authRoutes'

dotenv.config();

const app = express(); 

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({message: 'Grade Processor API'});
});

app.use('/auth', authRoutes);
app.use('/api/students', studentRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});