import Elysia from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { deleteLabelUseCase } from "./use-case";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import { deleteLabelParamsSchema, deleteLabelResponseSchema } from "./schemas";

export const deleteLabelRouter = new Elysia()
	.use(authMiddleware)
	.delete("/:id", async ({ params, status, session }) => {
		const result = await deleteLabelUseCase(params.id, session.activeOrganizationId);
		return status(200, result);
	}, 	{
    params: deleteLabelParamsSchema,
    requireOrganization:true,
		response: {
			200: deleteLabelResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},);
