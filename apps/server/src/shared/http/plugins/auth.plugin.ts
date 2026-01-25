import { auth } from "@blaboard/auth";
import { Elysia } from "elysia";

export const authPlugin = new Elysia({ name: "auth" }).all(
	"/api/auth/*",
	async ({ request }) => {
		return auth.handler(request);
	},
);
