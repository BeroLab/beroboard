import Elysia from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import { getMilestonesResponseSchema } from "./schemas";
import { getMilestones } from "./use-case";

export const getMilestonesRouter = new Elysia().use(authMiddleware).get(
	"/",
	async ({ status, session }) => {
		const result = await getMilestones(session.activeOrganizationId);

		return status(200, result);
	},
	{
		requireOrganization: true,
		response: {
			200: getMilestonesResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
