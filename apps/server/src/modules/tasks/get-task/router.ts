import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";
import {
	getTaskNotFoundResponseSchema,
	getTaskParamsSchema,
	getTaskResponseSchema,
} from "./schemas";
import { getTaskUseCase } from "./use-case";

export const getTaskRouter = new Elysia().use(authMiddleware).get(
	"/:id",
	async ({ params, status }) => {
		const result = await getTaskUseCase(params.id);

		return status(200, result);
	},
	{
		requireOrganization: true,
		params: getTaskParamsSchema,
		response: {
			200: getTaskResponseSchema,
			404: getTaskNotFoundResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	},
);
