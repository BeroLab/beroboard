import { prisma } from "@blaboard/db";

export async function deleteTaskUseCase(id: string, organizationId: string) {
	return await prisma.$transaction(async (tx) => {
		const task = await prisma.task.delete({
			where: { id, organizationId },
			include: { labels: { select: { id: true, text: true, color: true } } },
		});

		if (task.milestoneId) {
			const milestone = await tx.milestone.findUnique({
				where: { id: task.milestoneId },
				select: { taskIds: true },
			});

			if (milestone) {
				await tx.milestone.update({
					where: { id: task.milestoneId },
					data: {
						taskIds: {
							set: milestone.taskIds.filter((taskId) => taskId !== id),
						},
					},
				});
			}
		}

		if (task.labelIds.length > 0) {
			for (const labelId of task.labelIds) {
				const label = await tx.label.findUnique({
					where: {
						id: labelId,
					},
					select: {
						taskIds: true,
					},
				});

				if (label) {
					await tx.label.update({
						where: {
							id: labelId,
						},
						data: {
							taskIds: {
								set: label.taskIds.filter((taskId) => taskId !== id),
							},
						},
					});
				}
			}
		}

		return task;
	});
}
