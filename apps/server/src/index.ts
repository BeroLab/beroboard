import "dotenv/config";
import { auth } from "@beroboard/auth";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";

const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "",
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.all("/api/auth/*", async (context) => {
		const { request, status } = context;
		if (["POST", "GET"].includes(request.method)) {
			return auth.handler(request);
		}
		return status(405);
	})
	.get("/", () => "OK")
	.listen(3000, () => {
		console.log("Server is running on http://localhost:3000");
	});

console.log(
	`Elysia APP is running in the url ${app.server?.hostname} and the port ${app.server?.port}`,
);
