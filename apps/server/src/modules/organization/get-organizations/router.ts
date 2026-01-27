import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { getUserOrganizationsUseCase } from "./use-case";

export const getOrganizationsRouter = new Elysia()
	.use(authMiddleware)
	.get("/", async ({ session }) => {
		const organizations = await getUserOrganizationsUseCase(session.userId);
		return organizations;
	});
