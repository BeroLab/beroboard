import { prisma } from "@blaboard/db";
import type { UpdateTaskInput } from "./schemas";

export async function updateTaskUseCase(id: string, input: UpdateTaskInput) {
	return await prisma.$transaction(async (tx) => {
		const currentTask = await tx.task.findUnique({
			where: { id },
			include: {
				labels: true,
			},
		});

		if (!currentTask) throw new Error("Task not found");

		const newLabelIds = input.labels?.map((label) => label.id);

		const updatedTask = await tx.task.update({
			where: { id },
			data: {
				title: input.title,
				description: input.description,
				priority: input.priority,
				dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
				order: input.order,
				columnId: input.columnId,
				assigneeId: input.assigneeId,
				labelIds: newLabelIds,
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

		if (newLabelIds !== undefined) {
			const oldIds = currentTask.labelIds || [];
			const added = newLabelIds.filter((x) => !oldIds.includes(x));
			const removed = oldIds.filter((x) => !newLabelIds.includes(x));

			if (added.length > 0) {
				await tx.label.updateMany({
					where: { id: { in: added } },
					data: { taskIds: { push: id } },
				});
			}

			if (removed.length > 0) {
				for (const labelId of removed) {
					const label = await tx.label.findUnique({ where: { id: labelId } });
					if (label) {
						await tx.label.update({
							where: { id: labelId },
							data: {
								taskIds: {
									set: label.taskIds.filter((taskId) => taskId !== id),
								},
							},
						});
					}
				}
			}
		}

		return updatedTask;
	});
}
