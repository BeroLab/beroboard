import z from "zod";
import { zDate } from "@/shared/schemas/zod-date";

export const getMilestoneTasksParamsSchema = z.object({
	id: z.string().min(2),
});

const taskPrioritySchema = z.enum(["HIGH", "MEDIUM", "LOW", "NONE"]);

const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	image: z.string().nullable(),
});

export const getMilestoneTasksResponseSchema = z.array(
	z.object({
		id: z.string(),
		title: z.string(),
		description: z.string().nullable(),
		priority: taskPrioritySchema,
		dueDate: zDate.nullable(),
		order: z.number(),
		labelIds: z.array(z.string()),
		columnId: z.string(),
		assigneeId: z.string().nullable(),
		organizationId: z.string(),
		createdById: z.string(),
		createdAt: zDate,
		updatedAt: zDate,
		assignee: userSchema.nullable(),
		createdBy: userSchema,
		milestoneId: z.string().nullable(),
	}),
);
