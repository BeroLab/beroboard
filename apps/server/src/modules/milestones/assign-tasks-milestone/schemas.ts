import z from "zod";
import { milestonesStatusSchema } from "@/shared/schemas/milestone-status";
import { zDate } from "@/shared/schemas/zod-date";

export const assignTasksMilestoneParamsSchema = z.object({
	id: z.string().min(1),
});

export const assignTasksMilestoneBodySchema = z.object({
	taskIds: z.array(z.string()).min(1),
});

export type AssignTasksMilestoneBody = z.infer<
	typeof assignTasksMilestoneBodySchema
>;

export const assignTasksMilestoneResponseSchema = z.object({
	id: z.string(),
	description: z.string().nullable(),
	organizationId: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
	taskIds: z.array(z.string()),
	name: z.string(),
	status: milestonesStatusSchema,
	startDate: zDate.nullable(),
	endDate: zDate.nullable(),
});
