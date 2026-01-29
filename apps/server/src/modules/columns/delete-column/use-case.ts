import { prisma } from "@blaboard/db";

export async function deleteColumnUseCase(id: string) {
	return await prisma.column.delete({ where: { id } });
}
