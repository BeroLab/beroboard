import { prisma } from "@blaboard/db";
import type { ReorderColumnsInput } from "./schemas";

export async function reorderColumnsUseCase(input: ReorderColumnsInput) {
	const updates = input.columns.map((col) =>
		prisma.column.update({
			where: { id: col.id },
			data: { order: col.order },
		}),
	);
	await prisma.$transaction(updates);
	return { success: true };
}
