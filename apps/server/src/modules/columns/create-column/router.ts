import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { createColumnBodySchema } from "./schemas";
import { createColumnUseCase } from "./use-case";

export const createColumnRouter = new Elysia().use(authMiddleware).post(
	"/",
	async ({ body, session, status }) => {
		const result = await createColumnUseCase(
			session.activeOrganizationId,
			body,
		);

		return status(201, result);
	},
	{
		requireOrganization: true,
		body: createColumnBodySchema,
	},
);
