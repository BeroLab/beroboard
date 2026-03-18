import { prisma } from "@blaboard/db";
import type { AssignTasksMilestoneBody } from "./schemas";

export async function assignTasksMilestone(
	milestoneId: string,
	organizationId: string,
	input: AssignTasksMilestoneBody,
) {
	return await prisma.$transaction(async (tx) => {
		const taskWithMilestone = await tx.task.findMany({
			where: {
				id: { in: input.taskIds },
				organizationId,
				milestoneId: { not: null, notIn: [milestoneId] },
			},
			select: {
				id: true,
				milestoneId: true,
			},
		});

		for (const task of taskWithMilestone) {
			if (task.milestoneId) {
				const oldMilestone = await tx.milestone.findUnique({
					where: { id: task.milestoneId },
				});

				if (oldMilestone) {
					await tx.milestone.update({
						where: { id: task.milestoneId },
						data: {
							taskIds: {
								set: oldMilestone.taskIds.filter((tid) => tid !== task.id),
							},
						},
					});
				}
			}
		}

		await tx.task.updateMany({
			where: {
				id: { in: input.taskIds },
				organizationId,
			},
			data: {
				milestoneId: milestoneId,
			},
		});

		const currentMilestone = await tx.milestone.findUnique({
			where: { id: milestoneId },
		});

		const uniqueTaskIds = Array.from(
			new Set([...(currentMilestone?.taskIds || []), ...input.taskIds]),
		);

		return await tx.milestone.update({
			where: {
				id: milestoneId,
				organizationId,
			},
			data: {
				taskIds: { set: uniqueTaskIds },
			},
		});
	});
}
