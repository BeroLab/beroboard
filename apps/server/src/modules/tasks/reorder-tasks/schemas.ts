import { z } from "zod";

export const reorderTasksBodySchema = z.object({
	tasks: z.array(
		z.object({
			id: z.string().min(1),
			order: z.number().int(),
			columnId: z.string().min(1),
		}),
	),
});

export type ReorderTasksInput = z.infer<typeof reorderTasksBodySchema>;
