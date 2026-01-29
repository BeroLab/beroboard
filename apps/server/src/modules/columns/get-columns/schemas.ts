import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";

export const getColumnsSucessResponseSchema = z
	.object({
		tasks: z
			.object({
				assignee: z
					.object({
						name: z.string(),
						id: z.string(),
						image: z.string().nullable(),
					})
					.nullable(),
				description: z.string().nullable(),
				id: z.string(),
				createdAt: zDate,
				updatedAt: zDate,
				organizationId: z.string(),
				order: z.number(),
				title: z.string(),
				priority: z.enum(["LOW", "MEDIUM", "HIGH", "NONE"]),
				columnId: z.string(),
				dueDate: zDate.nullable(),
				assigneeId: z.string().nullable(),
				labels: z
					.object({
						text: z.string(),
						color: z.string(),
					})
					.array(),
			})
			.array(),
		id: z.string(),
		name: z.string(),
		color: z.string().nullable(),
		order: z.number(),
		isCompleted: z.boolean(),
		organizationId: z.string(),
		createdAt: zDate,
		updatedAt: zDate,
	})
	.array();
