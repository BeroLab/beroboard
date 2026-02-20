import { prisma } from "@blaboard/db";

export async function getColumnsUseCase(organizationId: string) {
	return await prisma.column.findMany({
		where: { organizationId },
		orderBy: { order: "asc" },
		include: {
			tasks: {
				orderBy: { order: "asc" },
				include: {
					assignee: {
						select: { id: true, name: true, image: true },
					},
					labels: {
						select: { id: true, text: true, color: true },
					},
				},
			},
		},
	});
}
