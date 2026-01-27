import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { createOrganizationBodySchema } from "./schemas";
import { createOrganizationUseCase } from "./use-case";

export const createOrganizationRouter = new Elysia()
	.use(authMiddleware)
	.post(
		"/",
		async ({ body, session, status, request }) => {
			const result = await createOrganizationUseCase(
				session.userId,
				body,
				request.headers,
			);

			return status(201, result);
		},
		{
			requireOrganization: false,
			body: createOrganizationBodySchema,
		},
	);
