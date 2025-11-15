import { auth, type Session } from "@beroboard/auth";
import type { Role } from "@beroboard/auth/roles";
import Elysia, { status } from "elysia";

export const authMiddleware = new Elysia({ name: "authMiddleware" }).macro({
   auth: (role: Role | boolean) => ({
      resolve: async ({ headers }) => {
         const session = (await auth.api.getSession({
            headers,
         })) as Session | null;
         if (!session?.user) {
            return status(401, "User not authorized");
         }
         const user = session.user;
         if (typeof role === "string" && user.role !== role) {
            return status(401, "User not authorized");
         }
         return {
            session,
            user: session.user,
         };
      },
   }),
});
