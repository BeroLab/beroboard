import { z } from "zod";

export const reorderColumnsBodySchema = z.object({
	columns: z.array(
		z.object({
			id: z.string().min(1),
			order: z.number().int(),
		}),
	),
});

export type ReorderColumnsInput = z.infer<typeof reorderColumnsBodySchema>;
