import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";
import { zHexColor } from "@/shared/schemas/zod-hex-color";

export const moveTaskBodySchema = z.object({
	taskId: z.string().min(1),
	columnId: z.string().min(1),
	order: z.number().int(),
});

export type MoveTaskInput = z.infer<typeof moveTaskBodySchema>;

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

export const moveTaskResponseSchema = z.object({
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
	assignee: z
		.object({
			id: z.string(),
			name: z.string(),
			image: z.string().nullable(),
		})
		.nullable(),
});
