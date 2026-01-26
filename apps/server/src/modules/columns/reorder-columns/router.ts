import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { reorderColumnsBodySchema } from "./schemas";
import { reorderColumnsUseCase } from "./use-case";

export const reorderColumnsRouter = new Elysia().use(authMiddleware).post(
	"/reorder",
	async ({ body, status }) => {
		const result = await reorderColumnsUseCase(body);

		return status(200, result);
	},
	{
		requireOrganization: true,
		body: reorderColumnsBodySchema,
	},
);
