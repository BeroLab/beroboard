import { prisma } from "@blaboard/db";
import type { UpdateTaskInput } from "./schemas";

export async function updateTaskUseCase(id: string, input: UpdateTaskInput) {
	return prisma.task.update({
		where: { id },
		data: {
			title: input.title,
			description: input.description,
			priority: input.priority,
			dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
			labels: input.labels,
			order: input.order,
			columnId: input.columnId,
			assigneeId: input.assigneeId,
		},
		include: {
			column: true,
			assignee: {
				select: { id: true, name: true, image: true },
			},
		},
	});
}
