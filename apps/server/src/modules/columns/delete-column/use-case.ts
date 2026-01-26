import { prisma } from "@blaboard/db";

export async function deleteColumnUseCase(id: string) {
	await prisma.column.delete({ where: { id } });
	return { success: true };
}
