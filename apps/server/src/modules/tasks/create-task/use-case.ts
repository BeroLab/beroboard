import { prisma } from "@blaboard/db";
import type { CreateTaskInput } from "./schemas";

export async function createTaskUseCase(
	organizationId: string,
	createdById: string,
	input: CreateTaskInput,
) {
	const lastTask = await prisma.task.findFirst({
		where: { columnId: input.columnId },
		orderBy: { order: "desc" },
  });
	
	const labelIdsToCreate = input.labels?.map((label) => label.id);

	return prisma.task.create({
		data: {
			title: input.title,
			description: input.description,
			priority: input.priority,
			dueDate: input.dueDate ? new Date(input.dueDate) : null,
			order: lastTask ? lastTask.order + 1 : 0,
			columnId: input.columnId,
			organizationId,
			assigneeId: input.assigneeId,
      createdById,
			...(labelIdsToCreate !== undefined && { labelIds: labelIdsToCreate }),
		},
		include: {
			column: true,
			assignee: {
				select: { id: true, name: true, image: true },
			},
			labels: {
				select: { id: true, text: true, color: true },
			},
		},
	});
}
