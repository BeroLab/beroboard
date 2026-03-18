import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import {
	updateMilestonesBodySchema,
	updateMilestonesParamsSchema,
	updateMilestonesResponseSchema,
} from "./schemas";
import { updateMilestone } from "./use-case";

export const updateMilestonesRouter = new Elysia().use(authMiddleware).patch(
	"/:id",
	async ({ status, session, body, params }) => {
		const result = await updateMilestone(
			session.activeOrganizationId,
			body,
			params.id,
		);

		return status(200, result);
	},
	{
		body: updateMilestonesBodySchema,
		requireOrganization: true,
		params: updateMilestonesParamsSchema,
		response: {
			200: updateMilestonesResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
