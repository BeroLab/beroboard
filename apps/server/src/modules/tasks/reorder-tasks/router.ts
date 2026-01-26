import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { reorderTasksBodySchema } from "./schemas";
import { reorderTasksUseCase } from "./use-case";

export const reorderTasksRouter = new Elysia().use(authMiddleware).post(
	"/reorder",
	async ({ body, status }) => {
		const result = await reorderTasksUseCase(body);

		return status(200, result);
	},
	{
		requireOrganization: true,
		body: reorderTasksBodySchema,
	},
);
