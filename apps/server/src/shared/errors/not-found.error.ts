import { APIError } from "./api.error";

export class NotFoundError extends APIError {
	readonly statusCode = 404 as const;
	readonly code = "NOT_FOUND";

	constructor({
		resource,
		identifier,
	}: {
		resource: string;
		identifier: string;
	}) {
		super(`${resource} not found`, { resource, identifier });
	}
}
