import { Elysia } from "elysia";
import { authMiddleware } from "@/shared/http/middleware/auth.middleware";
import { getUserOrganizationsUseCase } from "./use-case";

export const getOrganizationsRouter = new Elysia()
	.use(authMiddleware)
	.get("/", async ({ request }) => {
		const organizations = await getUserOrganizationsUseCase(request.headers);
		return organizations;
	});
