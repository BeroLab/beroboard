import { z } from "zod";

export const getTaskParamsSchema = z.object({
	id: z.string().min(1),
});
