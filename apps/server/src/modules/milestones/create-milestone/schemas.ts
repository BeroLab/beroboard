import z from "zod";
import { milestonesStatusSchema } from "@/shared/schemas/milestone-status";
import { zDate } from "@/shared/schemas/zod-date";

export const createMilestonesBodySchema = z
	.object({
		name: z.string().min(2).max(100),
		description: z.string().min(2).max(200).nullable(),
		status: milestonesStatusSchema,
		startDate: zDate.nullable(),
		endDate: zDate.nullable(),
	})
	.refine(
		(data) => {
			if (data.startDate && data.endDate) {
				const start = new Date(data.startDate);
				const end = new Date(data.endDate);
				return end >= start;
			}
			return true;
		},
		{
			message: "End date must be after or equal to start date",
			path: ["endDate"],
		},
	);

export type CreateMilestonesInput = z.infer<typeof createMilestonesBodySchema>;

export const createMilestonesResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	status: milestonesStatusSchema,
	startDate: zDate.nullable(),
	endDate: zDate.nullable(),
	organizationId: z.string(),
	taskIds: z.array(z.string()),
	createdAt: zDate,
	updatedAt: zDate,
});
