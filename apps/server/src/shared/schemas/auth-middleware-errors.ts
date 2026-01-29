import type { InvertedStatusMap } from "elysia";
import type { z } from "zod";
import { apiErrorSchema } from "./api-error";

type ResponseSchemas = Partial<Record<keyof InvertedStatusMap, z.ZodType>>;

const baseSchemas = {
	401: apiErrorSchema("No session found"),
	403: apiErrorSchema("Organization required"),
};

export const authMiddlewareErrorSchemas = Object.assign(baseSchemas, {
	extend<T extends ResponseSchemas>(extra: T): typeof baseSchemas & T {
		return { ...baseSchemas, ...extra };
	},
});
