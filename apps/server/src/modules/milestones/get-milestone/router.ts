import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import {
	getMilestoneParamsSchema,
	getMilestoneResponseSchema,
} from "./schemas";
import { getMilestone } from "./use-case";

export const getMilestoneRouter = new Elysia().use(authMiddleware).get(
	"/:id",
	async ({ status, params, session }) => {
		const result = await getMilestone(params.id, session.activeOrganizationId);
		return status(200, result);
	},
	{
		params: getMilestoneParamsSchema,
		requireOrganization: true,
		response: {
			200: getMilestoneResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
