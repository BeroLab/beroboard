import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { createTaskBodySchema } from "./schemas";
import { createTaskUseCase } from "./use-case";

export const createTaskRouter = new Elysia().use(authMiddleware).post(
	"/",
	async ({ body, session, user, status }) => {
		const result = await createTaskUseCase(
			session.activeOrganizationId,
			user.id,
			body,
		);

		return status(201, result);
	},
	{
		requireOrganization: true,
		body: createTaskBodySchema,
	},
);
