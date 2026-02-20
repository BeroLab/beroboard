import { prisma } from "@blaboard/db";
import type { MoveTaskInput } from "./schemas";

export async function moveTaskUseCase(input: MoveTaskInput) {
	return prisma.task.update({
		where: { id: input.taskId },
		data: {
			columnId: input.columnId,
			order: input.order,
		},
		include: {
			column: true,
			labels: {
				select: { id: true, color: true, text: true },
			},
			assignee: {
				select: { id: true, name: true, image: true },
			},
		},
	});
}
