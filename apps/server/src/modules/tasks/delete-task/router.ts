import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { deleteTaskParamsSchema } from "./schemas";
import { deleteTaskUseCase } from "./use-case";

export const deleteTaskRouter = new Elysia().use(authMiddleware).delete(
	"/:id",
	async ({ params, status }) => {
		const result = await deleteTaskUseCase(params.id);

		return status(200, result);
	},
	{
		requireOrganization: true,
		params: deleteTaskParamsSchema,
	},
);
