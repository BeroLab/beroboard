import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import {
	createMilestonesBodySchema,
	createMilestonesResponseSchema,
} from "./schemas";
import { createMilestone } from "./use-case";

export const createMilestoneRouter = new Elysia().use(authMiddleware).post(
	"/",
	async ({ status, session, body }) => {
		const result = await createMilestone(session.activeOrganizationId, body);
		return status(201, result);
	},
	{
		requireOrganization: true,
		body: createMilestonesBodySchema,
		response: {
			201: createMilestonesResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
