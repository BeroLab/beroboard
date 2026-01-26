import { z } from "zod";

export const createColumnBodySchema = z.object({
	name: z.string().min(1),
	color: z.string().optional(),
	isCompleted: z.boolean().optional().default(false),
});

export type CreateColumnInput = z.infer<typeof createColumnBodySchema>;
