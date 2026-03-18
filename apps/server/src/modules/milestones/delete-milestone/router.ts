import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import {
	deleteMilestoneParamsSchema,
	deleteMilestoneResponseSchema,
} from "./schemas";
import { deleteMilestone } from "./use-case";

export const deleteMilestonesRouter = new Elysia().use(authMiddleware).delete(
	"/:id",
	async ({ session, params, status }) => {
		const result = await deleteMilestone(
			params.id,
			session.activeOrganizationId,
		);

		return status(200, result);
	},
	{
		requireOrganization: true,
		params: deleteMilestoneParamsSchema,
		response: {
			200: deleteMilestoneResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
