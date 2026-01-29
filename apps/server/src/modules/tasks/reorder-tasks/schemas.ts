import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";

const taskPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]);

const taskLabelSchema = z.object({
	text: z.string(),
	color: z.string(),
});

export const reorderTasksBodySchema = z.object({
	tasks: z.array(
		z.object({
			id: z.string().min(1),
			order: z.number().int(),
			columnId: z.string().min(1),
		}),
	),
});

export type ReorderTasksInput = z.infer<typeof reorderTasksBodySchema>;

export const reorderTasksResponseSchema = z
	.object({
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
	})
	.array();
