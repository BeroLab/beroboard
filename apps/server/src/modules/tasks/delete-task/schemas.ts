import { z } from "zod";

export const deleteTaskParamsSchema = z.object({
	id: z.string().min(1),
});
