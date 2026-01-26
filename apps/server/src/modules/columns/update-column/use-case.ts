import { prisma } from "@blaboard/db";
import type { UpdateColumnInput } from "./schemas";

export async function updateColumnUseCase(
	id: string,
	input: UpdateColumnInput,
) {
	return prisma.column.update({
		where: { id },
		data: {
			name: input.name,
			color: input.color,
			order: input.order,
			isCompleted: input.isCompleted,
		},
	});
}
