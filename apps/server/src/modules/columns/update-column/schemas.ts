import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";

export const updateColumnParamsSchema = z.object({
	id: z.string().min(1),
});

export const updateColumnBodySchema = z.object({
	name: z.string().min(1).optional(),
	color: z.string().optional(),
	order: z.number().int().optional(),
	isCompleted: z.boolean().optional(),
});

export type UpdateColumnInput = z.infer<typeof updateColumnBodySchema>;

export const updateColumnResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
	organizationId: z.string(),
	color: z.string().nullable(),
	isCompleted: z.boolean(),
	order: z.number(),
});
