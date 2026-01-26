import { env } from "@blaboard/env/web";
import type { App } from "@blaboard/server";
import { treaty } from "@elysiajs/eden";

export const api = treaty<App>(env.NEXT_PUBLIC_SERVER_URL, {
	fetch: {
		credentials: "include",
	},
});
