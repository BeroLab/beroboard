import { z } from "zod";
import { zDate } from "@/shared/schemas/zod-date";
import { zHexColor } from "@/shared/schemas/zod-hex-color";

export const createLabelBodySchema = z.object({
	text: z.string().min(1).max(100),
	color: zHexColor.min(1).max(100),
});

export type CreateLabelInput = z.infer<typeof createLabelBodySchema>;

export const createLabelResponseSchema = z.object({
	id: z.string(),
	text: z.string(),
	color: zHexColor,
	taskIds: z.array(z.string()),
	organizationId: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
});
