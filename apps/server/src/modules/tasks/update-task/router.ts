import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { updateTaskBodySchema, updateTaskParamsSchema } from "./schemas";
import { updateTaskUseCase } from "./use-case";

export const updateTaskRouter = new Elysia().use(authMiddleware).patch(
	"/:id",
	async ({ params, body, status }) => {
		const result = await updateTaskUseCase(params.id, body);

		return status(200, result);
	},
	{
		requireOrganization: true,
		params: updateTaskParamsSchema,
		body: updateTaskBodySchema,
	},
);
