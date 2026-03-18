import { prisma } from "@blaboard/db";

export async function getLabelsUseCase(organizationId: string) {
	const labels = await prisma.label.findMany({
		where: {
			organizationId,
		},
		include: {
			tasks: {
				select: {
					id: true,
					title: true,
				},
			},
		},
	});

	return labels;
}
