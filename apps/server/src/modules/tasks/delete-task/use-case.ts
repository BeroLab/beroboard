import { prisma } from "@blaboard/db";

export async function deleteTaskUseCase(id: string) {
	return await prisma.task.delete({ where: { id } });
}
