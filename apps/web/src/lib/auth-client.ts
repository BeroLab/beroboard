import type { auth } from "@beroboard/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
   baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
   plugins: [inferAdditionalFields<typeof auth>()],
});
