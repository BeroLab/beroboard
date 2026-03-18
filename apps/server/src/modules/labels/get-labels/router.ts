import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import { getLabelsResponseSchema } from "./schemas";
import { getLabelsUseCase } from "./use-case";

export const getLabelsRouter = new Elysia().use(authMiddleware).get(
	"/",
	async ({ status, session }) => {
		const result = await getLabelsUseCase(session.activeOrganizationId);
		return status(200, result);
	},
	{
		requireOrganization: true,
		response: {
			200: getLabelsResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
