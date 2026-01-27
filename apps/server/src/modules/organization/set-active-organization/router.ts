import { Elysia, t } from "elysia";
import { auth } from "@blaboard/auth";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";

export const setActiveOrganizationRouter = new Elysia()
	.use(authMiddleware)
	.patch(
		"/active",
		async ({ body, request }) => {
			await auth.api.setActiveOrganization({
				body: {
					organizationId: body.organizationId,
				},
				headers: request.headers,
			});

			return { success: true, organizationId: body.organizationId };
		},
		{
			requireOrganization: false,
			body: t.Object({
				organizationId: t.String(),
			}),
		},
	);
