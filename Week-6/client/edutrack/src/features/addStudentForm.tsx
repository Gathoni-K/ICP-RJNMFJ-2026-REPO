import React from 'react';

export const AddStudentForm = ({ onAdd }: { onAdd: (name: string) => void }) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('studentName') as string;
    
    // Manual validation (Simple and fast)
    if (name.length > 0 && name.length <= 100) {
        onAdd(name);
        e.currentTarget.reset();
        }
    };

return (
    <form onSubmit={handleSubmit} className="flex gap-4 p-4 bg-white rounded-lg border">
        <input 
        name="studentName"
        required 
        minLength={1}
        maxLength={100}
        placeholder="Enter student name..."
        className="flex-1 p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Add Student
        </button>
        </form>
    );
};