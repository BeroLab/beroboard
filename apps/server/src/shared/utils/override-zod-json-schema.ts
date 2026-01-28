import type { ZodType } from "zod";

export function overrideJSONSchema<T extends ZodType>(
	schema: T,
	toJSONSchema: () => unknown | undefined,
) {
	schema._zod.toJSONSchema = toJSONSchema;

	return schema;
}
