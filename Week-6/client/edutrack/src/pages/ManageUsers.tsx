import { useEffect, useState } from 'react';
import { AddStudentForm } from '../features/addStudentForm';
import { AddStudentList } from '../features/addStudentList';
import { AddGradeForm } from '../features/addGradeForm';
import { apiRequest } from '../lib/api';
import type { Student } from '../../../../server/src/models/types';


const ManageUsers = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const loadStudents = async () => {
        try {
            const data = await apiRequest('/students');
            setStudents(data);
        } catch (error) {
            console.error("Failed to load:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (name: string) => {
        try {
            await apiRequest('/students', {
                method: 'POST',
                body: JSON.stringify({ name }),
            });
            loadStudents();
        } catch (error) {
            console.error("Failed to add student:", error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this student?")) {
            try {
                await apiRequest(`/students/${id}`, { method: 'DELETE' });
                if (selectedStudentId === id) setSelectedStudentId(null);
                loadStudents();
            } catch (error) {
                console.error("Failed to delete student:", error);
            }
        }
    };

    const handleAddGrade = async (subject: string, score: number) => {
        if (!selectedStudentId) return;
        try {
            await apiRequest(`/students/${selectedStudentId}/grades`, {
                method: 'POST',
                body: JSON.stringify({ subject, score }),
            });
            setSelectedStudentId(null);
            loadStudents();
        } catch (error) {
            console.error("Failed to add grade:", error);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    return (
        <main className="p-8 max-w-4xl mx-auto">
            <header className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Manage Students</h1>
                <p className="text-slate-500">Add or remove students from the processor.</p>
            </header>

            <div className="space-y-10">
                <section>
                    <AddStudentForm onAdd={handleAdd} />
                </section>
                
                <section>
                    <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
                        Current Enrollment ({students.length})
                    </h2>

                    {/* Selector for Grading */}
                    {students.length > 0 && (
                        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                            <label className="text-sm font-medium text-slate-700">Select Student to Grade:</label>
                            <select 
                                className="flex-1 p-2 rounded-lg border border-slate-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                value={selectedStudentId || ''}
                                onChange={(e) => setSelectedStudentId(e.target.value || null)}
                            >
                                <option value="">-- Choose a student --</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Grade Form specifically for the selected student */}
                    {selectedStudentId && (
                        <div className="mb-8 p-6 bg-indigo-50 border border-indigo-100 rounded-xl">
                            <h3 className="font-bold text-indigo-900 mb-4 text-sm uppercase tracking-tight">
                                Adding Grade for: {students.find(s => s.id === selectedStudentId)?.name}
                            </h3>
                            <AddGradeForm 
                                onAdd={handleAddGrade} 
                                onCancel={() => setSelectedStudentId(null)} 
                            />
                        </div>
                    )}

                    {/* The List Component - Using ONLY your existing props */}
                    <AddStudentList 
                        students={students} 
                        onDelete={handleDelete} 
                        isLoading={loading} 
                    />
                </section>
            </div>
        </main>
    );
};

export default ManageUsers;