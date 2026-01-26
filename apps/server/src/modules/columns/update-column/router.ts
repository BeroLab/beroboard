import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { updateColumnBodySchema, updateColumnParamsSchema } from "./schemas";
import { updateColumnUseCase } from "./use-case";

export const updateColumnRouter = new Elysia().use(authMiddleware).patch(
	"/:id",
	async ({ params, body, status }) => {
		const result = await updateColumnUseCase(params.id, body);

		return status(200, result);
	},
	{
		requireOrganization: true,
		params: updateColumnParamsSchema,
		body: updateColumnBodySchema,
	},
);
