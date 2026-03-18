import z from "zod";
import { zDate } from "@/shared/schemas/zod-date";
import { zHexColor } from "@/shared/schemas/zod-hex-color";

export const deleteLabelParamsSchema = z.object({
	id: z.string().min(1),
});

export const deleteLabelResponseSchema = z.object({
	id: z.string(),
	text: z.string(),
	color: zHexColor,
	taskIds: z.array(z.string()),
	organizationId: z.string(),
	createdAt: zDate,
	updatedAt: zDate,
});
