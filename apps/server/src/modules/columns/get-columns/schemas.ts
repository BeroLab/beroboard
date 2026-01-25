import { z } from "zod";

export const getColumnsQuerySchema = z.object({
	organizationId: z.string().min(1),
});
