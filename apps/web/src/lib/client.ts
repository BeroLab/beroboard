import type { App } from "@beroboard/server";
import { treaty } from "@elysiajs/eden";

const baseURL = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

export const apiClient = treaty<App>(baseURL);
