import { z } from "zod";

export const moveTaskBodySchema = z.object({
	taskId: z.string().min(1),
	columnId: z.string().min(1),
	order: z.number().int(),
});

export type MoveTaskInput = z.infer<typeof moveTaskBodySchema>;
