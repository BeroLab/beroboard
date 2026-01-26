import { auth } from "@blaboard/auth";
import { Elysia, status } from "elysia";
import { ForbiddenError } from "@/shared/errors/forbidden.error";

export const authMiddleware = new Elysia({ name: "auth-middleware" })
	.derive({ as: "scoped" }, async ({ request }) => {
		const session = await auth.api.getSession({
			headers: request.headers,
		});

		if (!session) {
			return status(401, { error: "Authentication required" });
		}

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
