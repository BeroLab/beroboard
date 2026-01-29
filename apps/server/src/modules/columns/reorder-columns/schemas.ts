import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";

export const reorderColumnsBodySchema = z.object({
	columns: z.array(
		z.object({
			id: z.string().min(1),
			order: z.number().int(),
		}),
	),
});

export type ReorderColumnsInput = z.infer<typeof reorderColumnsBodySchema>;

export const reorderColumnsResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		createdAt: zDate,
		updatedAt: zDate,
		organizationId: z.string(),
		color: z.string().nullable(),
		isCompleted: z.boolean(),
		order: z.number(),
	})
	.array();
