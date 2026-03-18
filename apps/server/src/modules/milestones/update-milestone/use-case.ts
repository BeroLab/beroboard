import { prisma } from "@blaboard/db";
import type { UpdateMilestonesBody } from "./schemas";

export async function updateMilestone(
	organizationId: string,
	input: UpdateMilestonesBody,
	id: string,
) {
	return await prisma.$transaction(async (tx) => {
		const currentMilestone = await tx.milestone.findUnique({
			where: { id, organizationId },
		});

		if (!currentMilestone) throw new Error("Milestone not found");

		const startDate = input.startDate
			? new Date(input.startDate)
			: currentMilestone.startDate;

		const endDate = input.endDate
			? new Date(input.endDate)
			: currentMilestone.endDate;

		if (startDate && endDate && endDate < startDate) {
			throw new Error("End date cannot be before start date");
		}

		if (input.taskIds) {
			await tx.task.updateMany({
				where: {
					milestoneId: id,
					id: { notIn: input.taskIds },
					organizationId,
				},
				data: { milestoneId: null },
			});

			await tx.task.updateMany({
				where: {
					id: { in: input.taskIds },
					organizationId,
				},
				data: { milestoneId: id },
			});
		}

		return await tx.milestone.update({
			where: { id, organizationId },
			data: {
				name: input.name,
				description: input.description,
				status: input.status,
				startDate: input.startDate,
				endDate: input.endDate,
				taskIds: input.taskIds,
			},
		});
	});
}
