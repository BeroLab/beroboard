import { APIError } from "./api.error";

export class ForbiddenError extends APIError {
	readonly statusCode = 403 as const;
	readonly code = "FORBIDDEN";

	constructor({
		message = "Forbidden",
		details,
	}: {
		message?: string;
		details?: Record<string, unknown>;
	} = {}) {
		super(message, details);
	}
}
