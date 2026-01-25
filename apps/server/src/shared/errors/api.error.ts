import type { InvertedStatusMap } from "elysia";

export type APIErrorResponse = {
	error: {
		code: string;
		message: string;
		details?: Record<string, unknown>;
	};
};

export abstract class APIError extends Error {
	abstract readonly statusCode: keyof InvertedStatusMap;
	abstract readonly code: string;
	readonly details?: Record<string, unknown>;

	constructor(message: string, details?: Record<string, unknown>) {
		super(message);
		this.name = this.constructor.name;
		this.details = details;

		Error.captureStackTrace?.(this, this.constructor);
	}

	toJSON(): APIErrorResponse {
		return {
			error: {
				code: this.code,
				message: this.message,
				...(this.details && { details: this.details }),
			},
		};
	}
}
