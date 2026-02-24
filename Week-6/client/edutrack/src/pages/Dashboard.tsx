import { useEffect, useState } from 'react';
import { studentService } from '../features/student-service';
import { StudentCard } from '../components/studentCard';
import type { Student } from '../types/types';

export const Dashboard = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentService.getAll()
        .then(setStudents)
        .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

    return (
        <main className="p-8 bg-slate-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
            <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900">Academic Overview</h1>
            <p className="text-slate-500">Real-time performance tracking for all students.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map(student => (
                <StudentCard 
                key={student.id} 
                student={student} 
                onClick={(id) => console.log("Navigate to Detail Page for student:", id)} 
                />
            ))}
            </div>
        </div>
        </main>
    );
    };  

export default Dashboard;