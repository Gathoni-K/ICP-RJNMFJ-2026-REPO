
import { Trash2, User, Loader2 } from 'lucide-react';
import type { Student } from '../types/types'; 

interface AddStudentListProps {
    students: Student[];
    onDelete: (id: string) => void;
    isLoading: boolean; 
}

export const AddStudentList: React.FC<AddStudentListProps> = ({ 
    students, 
    onDelete, 
    isLoading 
}) => {
  // 1. Loading State
    if (isLoading) {
        return (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
            <p className="text-slate-500 text-sm">Fetching enrollment list...</p>
        </div>
        );
    }

    // 2. Empty State
    if (students.length === 0) {
        return (
        <div className="text-center p-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500">No students found. Add your first student above.</p>
        </div>
        );
    }

    // 3. Data State
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <div className="flex items-center gap-2">
                    <User size={14} /> Student Name
                </div>
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                ID Reference
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
                </th>
            </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
            {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                    <span className="font-medium text-slate-800">{student.name}</span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400 font-mono">
                    {student.id.split('-')[0]}...
                </td>
                <td className="px-6 py-4 text-right">
                    <button
                    onClick={() => onDelete(student.id)}
                    className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    aria-label="Delete student"
                    >
                    <Trash2 size={18} />
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    };