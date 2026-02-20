import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";
import { zHexColor } from "@/shared/schemas/zod-hex-color";

export const taskPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]);

const taskLabelSchema = z.object({
	id: z.string(),
	text: z.string(),
	color: zHexColor,
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

const columnSchema = z.object({
	id: z.string(),
	name: z.string(),
	color: zHexColor.nullable(),
	order: z.number(),
	isCompleted: z.boolean(),
	organizationId: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
});

const assigneeSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		image: z.string().nullable(),
	})
	.nullable();

export const createTaskResponseSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().nullable(),
	priority: taskPrioritySchema,
	dueDate: zDate.nullable(),
	order: z.number(),
	labels: z.array(taskLabelSchema),
	labelIds: z.array(z.string()),
	columnId: z.string(),
	assigneeId: z.string().nullable(),
	organizationId: z.string(),
	createdById: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
	column: columnSchema,
	assignee: assigneeSchema,
});
