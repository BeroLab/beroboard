import { prisma } from "@blaboard/db";
import { auth } from "@blaboard/auth";
import type { CreateOrganizationInput } from "./schemas";

export async function createOrganizationUseCase(
	userId: string,
	input: CreateOrganizationInput,
	headers: Headers,
) {
	const organization = await prisma.organization.create({
		data: {
			name: input.name,
			description: input.description,
			userIds: [userId],
		},
	});

	await prisma.member.create({
		data: {
			id: `${organization.id}_${userId}`,
			organizationId: organization.id,
			userId: userId,
			role: "owner",
		},
	});

	await prisma.user.update({
		where: { id: userId },
		data: {
			organizationIds: {
				push: organization.id,
			},
		},
	});

	await auth.api.setActiveOrganization({
		body: {
			organizationId: organization.id,
		},
		headers,
	});

	return organization;
}
