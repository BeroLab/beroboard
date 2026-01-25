import { APIError } from "./api.error";

export class UnauthorizedError extends APIError {
	readonly statusCode = 401 as const;
	readonly code = "UNAUTHORIZED";

	constructor({
		message = "Unauthorized",
		details,
	}: {
		message?: string;
		details?: Record<string, unknown>;
	} = {}) {
		super(message, details);
	}
}
