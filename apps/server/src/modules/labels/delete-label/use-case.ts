import { prisma } from "@blaboard/db";

export async function deleteLabelUseCase(id: string, organizationId: string) {
	const label = await prisma.label.delete({
		where: { id, organizationId },
	});

	if (label.taskIds && label.taskIds.length > 0) {
		for (const taskId of label.taskIds) {
			const task = await prisma.task.findUnique({
				where: { id: taskId, organizationId },
				select: {
					labelIds: true,
				},
			});

			if (task) {
				await prisma.task.update({
					where: { id: taskId },
					data: {
						labelIds: {
							set: task.labelIds.filter((lid) => lid !== id),
						},
					},
				});
			}
		}
	}

	return label;
}
