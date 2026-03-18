import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";
import { zHexColor } from "@/shared/schemas/zod-hex-color";

export const deleteTaskParamsSchema = z.object({
	id: z.string().min(1),
});

const taskPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]);

const taskLabelSchema = z.object({
	id: z.string(),
	text: z.string(),
	color: zHexColor,
});

export const deleteTaskResponseSchema = z.object({
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
});
