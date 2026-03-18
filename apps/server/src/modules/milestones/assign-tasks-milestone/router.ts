import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import {
	assignTasksMilestoneBodySchema,
	assignTasksMilestoneParamsSchema,
	assignTasksMilestoneResponseSchema,
} from "./schemas";
import { assignTasksMilestone } from "./use-case";

export const assignTasksMilestoneRouter = new Elysia()
	.use(authMiddleware)
	.patch(
		":id/tasks",
		async ({ status, params, session, body }) => {
			const result = await assignTasksMilestone(
				params.id,
				session.activeOrganizationId,
				body,
			);
			return status(200, result);
		},
		{
			requireOrganization: true,
			body: assignTasksMilestoneBodySchema,
			params: assignTasksMilestoneParamsSchema,
			response: {
				200: assignTasksMilestoneResponseSchema,
				...authMiddlewareErrorSchemas,
			},
		},
	);
