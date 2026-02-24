import { z } from 'zod';

const idSchema = z.object({ id: z.string().uuid() });
const nameSchema = z.object({ name: z.string().min(1).max(100) });
const gradeSchema = z.object({
    subject: z.string().min(1).max(100),
    score: z.number().min(0).max(100)
});

export const addStudentSchema = nameSchema;
export const addGradeSchema = idSchema.merge(gradeSchema);
export const getStudentSchema = idSchema;
export const deleteStudentSchema = idSchema;
