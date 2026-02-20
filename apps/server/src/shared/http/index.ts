import { env } from "@blaboard/env/server";
import { cors } from "@elysiajs/cors";
import { openapi } from "@elysiajs/openapi";
import { Elysia } from "elysia";

import { columnsRouter } from "../../modules/columns/router";
import { tasksRouter } from "../../modules/tasks/router";
import { openapiConfig } from "../config/openapi";
import { authPlugin } from "./plugins/auth.plugin";
import { labelsRouter } from "@/modules/labels/router";
import { wsPlugin } from "./plugins/ws.plugin";

const app = new Elysia()
	.use(
		cors({
			origin: env.CORS_ORIGIN,
			methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		}),
	)
	.use(openapi(openapiConfig))
	.use(authPlugin)
	.use(wsPlugin) 
	.use([columnsRouter, tasksRouter, labelsRouter])
	.listen(env.PORT, ({ hostname, port }) =>
		console.log(`Server is running on http://${hostname}:${port}`),
	);

export type App = typeof app;
