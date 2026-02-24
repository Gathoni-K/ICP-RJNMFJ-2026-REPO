import { apiRequest } from '../lib/api';
import  type { Student } from '../types/types';

export const studentService = {
    getAll: async (): Promise<Student[]> => {
        return apiRequest('/students');
    },

    getById: async (id: string): Promise<Student> => {
        return apiRequest(`/students/${id}`);
    },

    create: async (name: string): Promise<Student> => {
        return apiRequest('/students', {
        method: 'POST',
        body: JSON.stringify({ name }),
        });
    },

    delete: async (id: string): Promise<void> => {
        return apiRequest(`/students/${id}`, { method: 'DELETE' });
    },

    // Note: Backend takes id, subject, score. 
    // We return the updated Student object if that's what your controller does.
    addGrade: async (studentId: string, subject: string, score: number): Promise<Student> => {
        return apiRequest(`/students/${studentId}/grades`, {
        method: 'POST',
        body: JSON.stringify({ subject, score }),
        });
    }
    };