import z from "zod";
import { milestonesStatusSchema } from "@/shared/schemas/milestone-status";
import { zDate } from "@/shared/schemas/zod-date";

const taskMilestonesSchema = z.object({
	id: z.string(),
	title: z.string(),
});

export const getMilestonesResponseSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullable(),
		status: milestonesStatusSchema,
		startDate: zDate.nullable(),
		endDate: zDate.nullable(),
		tasks: z.array(taskMilestonesSchema),
		progress: z.number().min(0).max(100),
		taskIds: z.array(z.string()),
		organizationId: z.string(),
		createdAt: zDate,
		updatedAt: zDate,
	}),
);
