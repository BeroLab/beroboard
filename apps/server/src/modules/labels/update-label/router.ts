import Elysia from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import {
	updateLabelBodySchema,
	updateLabelParamsSchema,
	updateLabelResponseSchema,
} from "./schemas";
import { updateLabelUseCase } from "./use-case";

export const updateLabelRouter = new Elysia().use(authMiddleware).patch(
	"/:id",
	async ({ params, body, status, session }) => {
		const result = await updateLabelUseCase(
			params.id,
			body,
			session.activeOrganizationId,
		);
		return status(200, result);
	},
	{
		body: updateLabelBodySchema,
		params: updateLabelParamsSchema,
		requireOrganization: true,
		response: {
			200: updateLabelResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
