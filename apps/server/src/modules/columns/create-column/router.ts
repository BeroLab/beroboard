import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import { createColumnBodySchema, createColumnResponseSchema } from "./schemas";
import { createColumnUseCase } from "./use-case";

export const createColumnRouter = new Elysia().use(authMiddleware).post(
	"/",
	async ({ body, session, status }) => {
		const result = await createColumnUseCase(
			session.activeOrganizationId,
			body,
		);

		return status(201, result);
	},
	{
		requireOrganization: true,
		body: createColumnBodySchema,
		response: {
			201: createColumnResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
