import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";

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

const columnSchema = z.object({
	id: z.string(),
	name: z.string(),
	color: z.string().nullable(),
	order: z.number(),
	isCompleted: z.boolean(),
	organizationId: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
});

export const updateTaskResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	priority: taskPrioritySchema,
	dueDate: zDate.nullable(),
	order: z.number(),
	labels: z.array(taskLabelSchema),
	columnId: z.string(),
	assigneeId: z.string().nullable(),
	organizationId: z.string(),
	createdById: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
	column: columnSchema,
	assignee: z
		.object({
			id: z.string(),
			name: z.string(),
			image: z.string().nullable(),
		})
		.nullable(),
});
