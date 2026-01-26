import { z } from "zod";

export const taskPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]);

export const taskLabelSchema = z.object({
	text: z.string().min(1),
	color: z.string().min(1),
});

export const updateTaskParamsSchema = z.object({
	id: z.string().min(1),
});

export const updateTaskBodySchema = z.object({
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	priority: taskPrioritySchema.optional(),
	dueDate: z.string().datetime().optional(),
	labels: z.array(taskLabelSchema).optional(),
	order: z.number().int().optional(),
	columnId: z.string().optional(),
	assigneeId: z.string().nullable().optional(),
});

export type UpdateTaskInput = z.infer<typeof updateTaskBodySchema>;
