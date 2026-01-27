import { z } from "zod";

export const deleteOrganizationParamsSchema = z.object({
	organizationId: z.string().min(1, "Organization ID is required"),
});

export type DeleteOrganizationParams = z.infer<
	typeof deleteOrganizationParamsSchema
>;
