import { z } from "zod";

export function apiErrorSchema<const T extends string[] = []>(...literals: T) {
	const messageSchema =
		literals.length > 0
			? z.union([...literals.map((l) => z.literal(l)), z.string()])
			: z.string();

	return z.object({
		error: z.object({
			code: z.string(),
			message: messageSchema,
			details: z.record(z.string(), z.unknown()).optional(),
		}),
	});
}
