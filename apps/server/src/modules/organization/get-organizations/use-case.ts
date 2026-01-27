import { prisma } from "@blaboard/db";

export async function getUserOrganizationsUseCase(userId: string) {
	const user = await prisma.user.findUnique({
		where: { id: userId },
		select: { organizationIds: true },
	});

	if (!user || !user.organizationIds || user.organizationIds.length === 0) {
		return [];
	}

	const organizations = await prisma.organization.findMany({
		where: {
			id: {
				in: user.organizationIds,
			},
		},
		select: {
			id: true,
			name: true,
			description: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	return organizations;
}
