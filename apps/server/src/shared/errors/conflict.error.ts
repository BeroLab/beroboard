import type { InvertedStatusMap } from "elysia";
import { APIError } from "./api.error";

export class ConflictError extends APIError {
	readonly statusCode: keyof InvertedStatusMap = 409;
	readonly code = "CONFLICT";

	constructor({
		message = "Resource already exists",
		details,
	}: {
		message?: string;
		details?: Record<string, unknown>;
	}) {
		super(message, details);
	}
}
