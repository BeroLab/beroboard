import { prisma } from "@blaboard/db";

export async function deleteTaskUseCase(id: string) {
	await prisma.task.delete({ where: { id } });
	return { success: true };
}
