import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { deleteColumnParamsSchema } from "./schemas";
import { deleteColumnUseCase } from "./use-case";

export const deleteColumnRouter = new Elysia().use(authMiddleware).delete(
	"/:id",
	async ({ params, status }) => {
		const result = await deleteColumnUseCase(params.id);

		return status(200, result);
	},
	{
		requireOrganization: true,
		params: deleteColumnParamsSchema,
	},
);
