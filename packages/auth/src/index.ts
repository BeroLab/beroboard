import prisma from "@beroboard/db";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import type { UserRole } from "../../db/prisma/generated/enums";

export const auth = betterAuth<BetterAuthOptions>({
   database: prismaAdapter(prisma, {
      provider: "postgresql",
   }),
   trustedOrigins: [process.env.CORS_ORIGIN || ""],
   emailAndPassword: {
      enabled: true,
   },
   advanced: {
      defaultCookieAttributes: {
         sameSite: "none",
         secure: true,
         httpOnly: true,
      },
   },
   user: {
      additionalFields: {
         role: {
            type: ["USER", "ADMIN"] as UserRole[],
            required: true,
            defaultValue: "USER",
            input: false,
            returned: true,
         },
      },
   },
});

// Export session type with role field included
export type Session = Awaited<ReturnType<typeof auth.api.getSession>> & {
   user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      image?: string | null;
      role: UserRole;
      createdAt: Date;
      updatedAt: Date;
   };
};
