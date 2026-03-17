import { prisma } from "@blaboard/db";

export async function deleteMilestone(id: string, organizationId: string) {
	return await prisma.$transaction(async (tx) => {
		await tx.task.updateMany({
			where: { milestoneId: id, organizationId },
			data: { milestoneId: null },
		});
		return await tx.milestone.delete({ where: { id, organizationId } });
	});
}
