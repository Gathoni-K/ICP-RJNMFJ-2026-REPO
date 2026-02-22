import {
    getStudentsById,
    addStudent,
    calculateAverage,
    deleteStudent,
    addStudentGrade
} from '../controllers/studentController';
import { supabase } from '../config/supabase';

jest.mock('../config/supabase', () => ({
    supabase: {
        from: jest.fn()
    }
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

// ─── getStudentById ───────────────────────────────────────────────

describe('getStudentsById', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should return a student with grades when found', async () => {
        const mockStudent = {
            id: '123',
            name: 'John Doe',
            grades: [{ subject: 'Math', score: 85 }]
        };

        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: mockStudent,
                        error: null
                    })
                })
            })
        } as unknown as any);

        const result = await getStudentsById('123');
        expect(result).toEqual(mockStudent);
        expect(result?.grades).toHaveLength(1);
    });

    it('should return null when student is not found', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: null,
                        error: { code: 'PGRST116', message: 'Not found' }
                    })
                })
            })
        } as unknown as any);

        const result = await getStudentsById('nonexistent-id');
        expect(result).toBeNull();
    });

    it('should throw an error when the database fails', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: null,
                        error: { code: 'CONNECTION_ERROR', message: 'Database unreachable' }
                    })
                })
            })
        } as unknown as any);

        await expect(getStudentsById('123')).rejects.toThrow('Failed to fetch student');
    });
});

// ─── addStudent ───────────────────────────────────────────────────

describe('addStudent', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should return a new student with an empty grades array', async () => {
        const mockStudent = { id: '123', name: 'John Doe' };

        mockSupabase.from.mockReturnValue({
            insert: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: mockStudent,
                        error: null
                    })
                })
            })
        } as unknown as any);

        const result = await addStudent('John Doe');
        expect(result).toEqual({ ...mockStudent, grades: [] });
        expect(result.grades).toHaveLength(0);
    });

    it('should throw an error when the database fails', async () => {
        mockSupabase.from.mockReturnValue({
            insert: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: null,
                        error: { message: 'Insert failed' }
                    })
                })
            })
        } as unknown as any);

        await expect(addStudent('John Doe')).rejects.toThrow('Failed to add student');
    });
});

// ─── calculateAverage ─────────────────────────────────────────────

describe('calculateAverage', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should return the correct average when student has grades', async () => {
        const mockStudent = {
            id: '123',
            name: 'John Doe',
            grades: [
                { subject: 'Math', score: 80 },
                { subject: 'English', score: 90 }
            ]
        };

        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: mockStudent,
                        error: null
                    })
                })
            })
        } as unknown as any);

        const result = await calculateAverage('123');
        expect(result).toBe(85);
    });

    it('should return null when student has no grades', async () => {
        const mockStudent = { id: '123', name: 'John Doe', grades: [] };

        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: mockStudent,
                        error: null
                    })
                })
            })
        } as unknown as any);

        const result = await calculateAverage('123');
        expect(result).toBeNull();
    });

    it('should return null when student does not exist', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: null,
                        error: { code: 'PGRST116', message: 'Not found' }
                    })
                })
            })
        } as unknown as any);

        const result = await calculateAverage('nonexistent-id');
        expect(result).toBeNull();
    });
});

// ─── deleteStudent ────────────────────────────────────────────────

describe('deleteStudent', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should return true when student is deleted successfully', async () => {
        mockSupabase.from.mockReturnValue({
            delete: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                    data: null,
                    error: null
                })
            })
        } as unknown as any);

        const result = await deleteStudent('123');
        expect(result).toBe(true);
    });

    it('should return false when student is not found', async () => {
        mockSupabase.from.mockReturnValue({
            delete: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                    data: null,
                    error: { code: 'PGRST116', message: 'Not found' }
                })
            })
        } as unknown as any);

        const result = await deleteStudent('nonexistent-id');
        expect(result).toBe(false);
    });

    it('should throw an error when the database fails', async () => {
        mockSupabase.from.mockReturnValue({
            delete: jest.fn().mockReturnValue({
                eq: jest.fn().mockResolvedValue({
                    data: null,
                    error: { code: 'CONNECTION_ERROR', message: 'Database unreachable' }
                })
            })
        } as unknown as any);

        await expect(deleteStudent('123')).rejects.toThrow('Failed to delete student');
    });
});

// ─── addStudentGrade ──────────────────────────────────────────────

describe('addStudentGrade', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should return the updated student after adding a grade', async () => {
        const mockStudent = {
            id: '123',
            name: 'John Doe',
            grades: [{ subject: 'Math', score: 85 }]
        };

        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: mockStudent,
                        error: null
                    })
                })
            }),
            insert: jest.fn().mockReturnValue({
                mockResolvedValue: jest.fn().mockResolvedValue({
                    data: null,
                    error: null
                })
            })
        } as unknown as any);

        const result = await addStudentGrade('123', 'Math', 85);
        expect(result).toEqual(mockStudent);
    });

    it('should return null when student does not exist', async () => {
        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: null,
                        error: { code: 'PGRST116', message: 'Not found' }
                    })
                })
            })
        } as unknown as any);

        const result = await addStudentGrade('nonexistent-id', 'Math', 85);
        expect(result).toBeNull();
    });

    it('should throw an error when the grade insert fails', async () => {
        const mockStudent = { id: '123', name: 'John Doe', grades: [] };

        mockSupabase.from.mockReturnValue({
            select: jest.fn().mockReturnValue({
                eq: jest.fn().mockReturnValue({
                    single: jest.fn().mockResolvedValue({
                        data: mockStudent,
                        error: null
                    })
                })
            }),
            insert: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Insert failed' }
            })
        } as unknown as any);

        await expect(addStudentGrade('123', 'Math', 85))
            .rejects.toThrow('Failed to add grade');
    });
});