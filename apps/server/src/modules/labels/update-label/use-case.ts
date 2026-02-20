import { prisma } from "@blaboard/db";
import type { UpdateLabelBodySchema } from "./schemas";

export async function updateLabelUseCase(
	id: string,
	input: UpdateLabelBodySchema,
	organizationId: string,
) {
	return prisma.label.update({
		where: {
			id,
			organizationId,
		},
		data: {
			text: input.text,
			color: input.color,
		},
	});
}
