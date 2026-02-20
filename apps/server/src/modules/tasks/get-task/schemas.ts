import { z } from "zod";
import { apiErrorSchema } from "@/shared/schemas/api-error";
import { zDate } from "@/shared/schemas/zod-date";
import { zHexColor } from "@/shared/schemas/zod-hex-color";

export const getTaskParamsSchema = z.object({
	id: z.string().min(1),
});

const taskPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]);

const taskLabelSchema = z.object({
	id: z.string(),
	text: z.string(),
	color: zHexColor,
});

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

const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	image: z.string().nullable(),
});

export const getTaskResponseSchema = z.object({
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
	assignee: userSchema.nullable(),
	createdBy: userSchema,
});

export const getTaskNotFoundResponseSchema = apiErrorSchema("Task not found");
