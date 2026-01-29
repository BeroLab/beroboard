import { auth } from "@blaboard/auth";
import { Elysia } from "elysia";
import { ForbiddenError } from "@/shared/errors/forbidden.error";
import { UnauthorizedError } from "@/shared/errors/unauthorized.error";

export const authMiddleware = new Elysia({ name: "auth-middleware" })
	.derive({ as: "scoped" }, async ({ request }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session) throw new UnauthorizedError({ message: "No session found" });

		return {
			user: session.user,
			session: session.session,
		};
	})
	.macro({
		requireOrganization: {
			resolve({ session }) {
				const activeOrganizationId = session?.activeOrganizationId;

				if (typeof activeOrganizationId !== "string") {
					throw new ForbiddenError({ message: "Organization required" });
				}

				return {
					session: { ...session, activeOrganizationId },
				};
			},
		},
	});
