import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(['ADMIN', 'MEMBER']).default('MEMBER'),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const projectSchema = z.object({
  name: z.string().min(2, "Project name must be at least 2 characters"),
  description: z.string().optional(),
});

export const taskSchema = z.object({
  title: z.string().min(2, "Task title must be at least 2 characters"),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).default('TODO'),
  dueDate: z.string().optional().nullable(),
  projectId: z.string().uuid("Invalid project ID"),
  assignedToId: z.string().uuid("Invalid user ID").optional().nullable(),
});

export const memberSchema = z.object({
  email: z.string().email("Invalid email address"),
});
