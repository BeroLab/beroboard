import { z } from "zod";

export const deleteColumnParamsSchema = z.object({
	id: z.string().min(1),
});
