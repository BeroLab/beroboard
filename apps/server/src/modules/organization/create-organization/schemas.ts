import { z } from "zod";

export const createOrganizationBodySchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().optional().default(""),
});

export type CreateOrganizationInput = z.infer<
	typeof createOrganizationBodySchema
>;
