import { z } from "zod";

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
