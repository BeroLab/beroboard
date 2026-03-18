import { prisma } from "@blaboard/db";
import type { CreateLabelInput } from "./schemas";

export async function createLabelUseCase(
	organizationId: string,
	input: CreateLabelInput,
) {
	return prisma.label.create({
		data: {
			text: input.text,
			color: input.color,
			organizationId,
		},
	});
}
