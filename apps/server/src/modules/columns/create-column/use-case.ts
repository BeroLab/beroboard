import { prisma } from "@blaboard/db";
import type { CreateColumnInput } from "./schemas";

export async function createColumnUseCase(
	organizationId: string,
	input: CreateColumnInput,
) {
	const lastColumn = await prisma.column.findFirst({
		where: { organizationId },
		orderBy: { order: "desc" },
	});

	return prisma.column.create({
		data: {
			name: input.name,
			color: input.color,
			order: lastColumn ? lastColumn.order + 1 : 0,
			isCompleted: input.isCompleted ?? false,
			organizationId,
		},
	});
}
