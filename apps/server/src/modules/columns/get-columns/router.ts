import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import { getColumnsSucessResponseSchema } from "./schemas";
import { getColumnsUseCase } from "./use-case";

export const getColumnsRouter = new Elysia().use(authMiddleware).get(
	"/",
	async ({ session, status }) => {
		const result = await getColumnsUseCase(session.activeOrganizationId);

		return status(200, result);
	},
	{
		requireOrganization: true,
		response: {
			200: getColumnsSucessResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
