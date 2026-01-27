import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { deleteOrganizationParamsSchema } from "./schemas";
import { deleteOrganizationUseCase } from "./use-case";

export const deleteOrganizationRouter = new Elysia()
	.use(authMiddleware)
	.delete(
		"/:organizationId",
		async ({ params, session, status, request }) => {
			const result = await deleteOrganizationUseCase(
				session.userId,
				params,
				request.headers,
			);

			return status(200, result);
		},
		{
			requireOrganization: false,
			params: deleteOrganizationParamsSchema,
		},
	);
