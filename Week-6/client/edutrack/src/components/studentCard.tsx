import React from 'react';
import type  { Student } from '../types/types';
import { Calculator, BookOpen } from 'lucide-react';

interface StudentCardProps {
    student: Student;
    onClick: (id: string) => void;
    }

export const StudentCard: React.FC<StudentCardProps> = ({ student, onClick }) => {
  // Logic: Calculate average from the nested grades array
    const average = student.grades.length > 0 
        ? (student.grades.reduce((acc, curr) => acc + curr.score, 0) / student.grades.length).toFixed(1)
        : 'N/A';

    return (
        <div 
        onClick={() => onClick(student.id)}
        className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer group"
        >
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
            {student.name}
            </h3>
            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">
            {student.id.slice(0, 8)}
            </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-slate-600">
            <BookOpen size={16} className="text-indigo-500" />
            <span className="text-sm">{student.grades.length} Subjects</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
            <Calculator size={16} className="text-emerald-500" />
            <span className="text-sm font-bold">Avg: {average}%</span>
            </div>
        </div>
        </div>
    );
    };