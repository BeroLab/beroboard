import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { moveTaskBodySchema } from "./schemas";
import { moveTaskUseCase } from "./use-case";

export const moveTaskRouter = new Elysia().use(authMiddleware).post(
	"/move",
	async ({ body, status }) => {
		const result = await moveTaskUseCase(body);

		return status(200, result);
	},
	{
		requireOrganization: true,
		body: moveTaskBodySchema,
	},
);
