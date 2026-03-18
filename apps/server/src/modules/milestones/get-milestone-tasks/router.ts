import { Elysia } from "elysia";
import {
	getMilestoneTasksParamsSchema,
	getMilestoneTasksResponseSchema,
} from "@/modules/milestones/get-milestone-tasks/schemas";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { getMilestoneTasks } from "./use-case";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";

export const getMilestoneTasksRouter = new Elysia().use(authMiddleware).get(
	":id/tasks",
	async ({ status, params, session }) => {
		const result = await getMilestoneTasks(
			params.id,
			session.activeOrganizationId,
		);
		return status(200, result);
	},
  {
    requireOrganization: true,
		params: getMilestoneTasksParamsSchema,
    response: {
      200: getMilestoneTasksResponseSchema,
      ...authMiddlewareErrorSchemas
		},
	},
);
