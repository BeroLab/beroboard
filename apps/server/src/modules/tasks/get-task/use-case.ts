import { prisma } from "@blaboard/db";
import { NotFoundError } from "@/shared/errors/not-found.error";

const taskInclude = {
	column: true,
	assignee: {
		select: { id: true, name: true, image: true },
	},
	createdBy: {
		select: { id: true, name: true, image: true },
	},
	labels: {
		select: {
			id: true,
			text: true,
			color: true,
		},
	},
} as const;

export async function getTaskUseCase(id: string) {
	const task = await prisma.task.findUnique({
		where: { id },
		include: taskInclude,
	});

	if (!task) throw new NotFoundError({ resource: "Task", identifier: id });

	return task;
}
