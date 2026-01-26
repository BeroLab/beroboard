import { prisma } from "@blaboard/db";

const taskInclude = {
	column: true,
	assignee: {
		select: { id: true, name: true, image: true },
	},
	createdBy: {
		select: { id: true, name: true, image: true },
	},
} as const;

export async function getTaskUseCase(id: string) {
	return prisma.task.findUnique({
		where: { id },
		include: taskInclude,
	});
}
