import { prisma } from "@blaboard/db";

export async function getMilestones(organizationId: string) {
	const milestones = await prisma.milestone.findMany({
		where: {
			organizationId,
		},
		include: {
			_count: { select: { tasks: true } },
			tasks: {
				include: {
					column: {
						select: { isCompleted: true },
					},
				},
			},
		},
	});

	return milestones.map((milestone) => {
		const totalTasks = milestone._count.tasks;
		const completedTasks = milestone.tasks.filter(
			(task) => task.column.isCompleted,
		).length;
		const progress =
			totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

		return {
			...milestone,
			progress,
			tasks: milestone.tasks.map((t) => ({ id: t.id, title: t.title })),
		};
	});
}
