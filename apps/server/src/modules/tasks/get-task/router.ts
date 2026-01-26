import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { getTaskParamsSchema } from "./schemas";
import { getTaskUseCase } from "./use-case";

export const getTaskRouter = new Elysia().use(authMiddleware).get(
	"/:id",
	async ({ params, status }) => {
		const result = await getTaskUseCase(params.id);

		if (!result) {
			return status(404, { error: "Task not found" });
		}

		return status(200, result);
	},
	{
		requireOrganization: true,
		params: getTaskParamsSchema,
	},
);
