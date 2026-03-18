import { prisma } from "@blaboard/db";
import { NotFoundError } from "@/shared/errors/not-found.error";

export async function getMilestone(id: string, organizationId: string) {
	const milestone = await prisma.milestone.findUnique({
		where: { id, organizationId },
		include: {
			_count: {
				select: {
					tasks: true,
				},
			},
			tasks: {
				where: {
					column: {
						isCompleted: true,
					},
				},
				select: { id: true },
			},
		},
	});

	if (!milestone)
		throw new NotFoundError({ resource: "Milestone", identifier: id });

	const totalTasks = milestone._count.tasks;
	const completedTasks = milestone.tasks.length;
	const progress =
		totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	const { tasks, _count, ...milestoneData } = milestone;

	return {
		...milestoneData,
		progress,
	};
}
