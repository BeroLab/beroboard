import { prisma } from "@blaboard/db";
import type { CreateTaskInput } from "./schemas";

export async function createTaskUseCase(
	organizationId: string,
	createdById: string,
	input: CreateTaskInput,
) {
	return await prisma.$transaction(async (tx) => {
		const lastTask = await tx.task.findFirst({
			where: { columnId: input.columnId },
			orderBy: { order: "desc" },
		});

		const labelIds = input.labels?.map((label) => label.id) || [];

		const task = await tx.task.create({
			data: {
				title: input.title,
				description: input.description,
				priority: input.priority,
				dueDate: input.dueDate ? new Date(input.dueDate) : null,
				order: lastTask ? lastTask.order + 1 : 0,
				columnId: input.columnId,
				organizationId,
				assigneeId: input.assigneeId,
				createdById,
				labelIds: labelIds,
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

		if (labelIds.length > 0) {
			await tx.label.updateMany({
				where: { id: { in: labelIds } },
				data: {
					taskIds: { push: task.id },
				},
			});
		}

		return task;
	});
}
