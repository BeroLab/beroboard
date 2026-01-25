import { z } from "zod";

export const createColumnSchema = z.object({
	name: z.string().min(1),
	color: z.string().optional(),
	isCompleted: z.boolean().optional().default(false),
	organizationId: z.string().min(1),
});

export const updateColumnSchema = z.object({
	name: z.string().min(1).optional(),
	color: z.string().optional(),
	order: z.number().int().optional(),
	isCompleted: z.boolean().optional(),
});

export const reorderColumnsSchema = z.object({
	columns: z.array(
		z.object({
			id: z.string().min(1),
			order: z.number().int(),
		}),
	),
});

export const columnIdParamSchema = z.object({
	id: z.string().min(1),
});

export type CreateColumnInput = z.infer<typeof createColumnSchema>;
export type UpdateColumnInput = z.infer<typeof updateColumnSchema>;
export type ReorderColumnsInput = z.infer<typeof reorderColumnsSchema>;
