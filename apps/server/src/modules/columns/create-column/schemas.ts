import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";

export const createColumnBodySchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
	color: z.string().optional(),
	isCompleted: z.boolean().optional().default(false),
});

export type CreateColumnInput = z.infer<typeof createColumnBodySchema>;

export const createColumnResponseSchema = z.object({
	name: z.string(),
	description: z.string().nullable(),
	id: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
	organizationId: z.string(),
	color: z.string().nullable(),
	isCompleted: z.boolean(),
	order: z.number(),
});
