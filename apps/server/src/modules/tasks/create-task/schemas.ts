import { z } from "zod";

export const taskPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]);

export const taskLabelSchema = z.object({
	text: z.string().min(1),
	color: z.string().min(1),
});

export const createTaskBodySchema = z.object({
	title: z.string().min(1),
	description: z.string().optional(),
	priority: taskPrioritySchema.optional().default("NONE"),
	dueDate: z.string().datetime().optional(),
	labels: z.array(taskLabelSchema).optional().default([]),
	columnId: z.string().min(1),
	assigneeId: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskBodySchema>;
export type TaskLabel = z.infer<typeof taskLabelSchema>;
