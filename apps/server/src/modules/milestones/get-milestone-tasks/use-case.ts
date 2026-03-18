import { prisma } from "@blaboard/db";

export async function getMilestoneTasks(id: string, organizationId: string) {
	const milestoneTasks = await prisma.task.findMany({
		where: { milestoneId: id, organizationId },
		include: { assignee: true, createdBy: true },
	});

	return milestoneTasks;
}
