import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";

export const deleteColumnParamsSchema = z.object({
	id: z.string().min(1),
});

export const deleteColumnResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
	organizationId: z.string(),
	color: z.string().nullable(),
	isCompleted: z.boolean(),
	order: z.number(),
});
