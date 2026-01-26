import { prisma } from "@blaboard/db";
import { env } from "@blaboard/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { organization } from "better-auth/plugins";

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: "mongodb",
	}),

	emailAndPassword: {
		enabled: false,
	},

	baseURL: env.BETTER_AUTH_URL,
	secret: process.env.BETTER_AUTH_SECRET!,
	trustedOrigins: [env.CORS_ORIGIN],

	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			accessType: "offline",
			prompt: "select_account consent",
		},

		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
		},
	},

	user: {
		additionalFields: {
			role: {
				type: "string",
				required: false,
				defaultValue: "ADMIN",
				input: false,
			},
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
	},

	advanced: {
		defaultCookieAttributes: {
			sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
			secure: process.env.NODE_ENV === "production",
			httpOnly: true,
		},
	},
	plugins: [organization()],
});

export type Auth = typeof auth;
