import type { ElysiaOpenAPIConfig } from "@elysiajs/openapi";
import { z } from "zod";

export const openapiConfig = {
	path: "/swagger",
	mapJsonSchema: {
		zod: z.toJSONSchema,
	},
} satisfies ElysiaOpenAPIConfig;
