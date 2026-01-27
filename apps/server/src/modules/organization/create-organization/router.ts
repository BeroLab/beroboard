import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { ConflictError } from "@/shared/errors/conflict.error";
import { createOrganizationBodySchema } from "./schemas";
import { createOrganizationUseCase } from "./use-case";

export const createOrganizationRouter = new Elysia()
	.use(authMiddleware)
	.post(
		"/",
		async ({ body, status, request }) => {
			try {
				const result = await createOrganizationUseCase(body, request.headers);
				return status(201, result);
			} catch (error) {
				if (error instanceof ConflictError) {
					return status(409, error.toJSON());
				}
				throw error;
			}
		},
		{
			requireOrganization: false,
			body: createOrganizationBodySchema,
		},
	);
