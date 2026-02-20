import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { createLabelUseCase } from "./use-case";
import { createLabelBodySchema, createLabelResponseSchema } from "./schemas";
import { authMiddlewareErrorSchemas } from "@/shared/schemas/auth-middleware-errors";

export const createLabelRouter = new Elysia()
	.use(authMiddleware)
	.post("/", async ({ body, status, session }) => {
		const result = await createLabelUseCase(session.activeOrganizationId, body);
		return status(201, result);
  }, {
    requireOrganization: true,
    body: createLabelBodySchema,
    response: {
			201: createLabelResponseSchema,
			...authMiddlewareErrorSchemas,
		},
	});
