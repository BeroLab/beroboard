import z from "zod";
import { zDate } from "@/shared/schemas/zod-date";
import { zHexColor } from "@/shared/schemas/zod-hex-color";

const taskLabelSchema = z.object({
	id: z.string(),
	title: z.string(),
});

export const getLabelsResponseSchema = z.array(
	z.object({
		id: z.string(),
		text: z.string(),
		color: zHexColor,
		taskIds: z.string().array(),
		tasks: z.array(taskLabelSchema),
		organizationId: z.string(),
		createdAt: zDate,
		updatedAt: zDate,
	}),
);
