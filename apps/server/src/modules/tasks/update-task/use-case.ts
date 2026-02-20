import { prisma } from "@blaboard/db";
import type { UpdateTaskInput } from "./schemas";

export async function updateTaskUseCase(id: string, input: UpdateTaskInput) {
	const labelIdsToUpdate = input.labels?.map((label) => label.id);

	return prisma.task.update({
		where: { id },
		data: {
			title: input.title,
			description: input.description,
			priority: input.priority,
			dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
			order: input.order,
			columnId: input.columnId,
			assigneeId: input.assigneeId,
			...(labelIdsToUpdate !== undefined && { labelIds: labelIdsToUpdate }),
		},
		include: {
			column: true,
			assignee: {
				select: { id: true, name: true, image: true },
			},
			labels: {
				select: { id: true, text: true, color: true },
			},
		},
	});
}
