import { prisma } from "@blaboard/db";
import type { ReorderTasksInput } from "./schemas";

export async function reorderTasksUseCase(input: ReorderTasksInput) {
	const updates = input.tasks.map((task) =>
		prisma.task.update({
			where: { id: task.id },
			data: { order: task.order, columnId: task.columnId },
		}),
	);
	return await prisma.$transaction(updates);
}
