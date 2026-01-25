import { env } from "@blaboard/env/server";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import { columnsRouter } from "../../modules/columns/router";
import { tasksRouter } from "../../modules/tasks/router";
import { authPlugin } from "./plugins/auth.plugin";

const app = new Elysia()
	.use(
		cors({
			origin: env.CORS_ORIGIN,
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.use(authPlugin)
	.use([columnsRouter, tasksRouter])
	.listen(env.PORT, ({ hostname, port }) =>
		console.log(`Server is running on http://${hostname}:${port}`),
	);

export type App = typeof app;
