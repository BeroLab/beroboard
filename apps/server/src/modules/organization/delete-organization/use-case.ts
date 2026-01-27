import { prisma } from "@blaboard/db";
import { auth } from "@blaboard/auth";
import type { DeleteOrganizationParams } from "./schemas";

export async function deleteOrganizationUseCase(
	userId: string,
	params: DeleteOrganizationParams,
	headers: Headers,
) {
	const { organizationId } = params;

	// Check if user is a member of the organization
	const member = await prisma.member.findUnique({
		where: {
			organizationId_userId: {
				organizationId,
				userId,
			},
		},
	});

	if (!member) {
		throw new Error("You are not a member of this organization");
	}

	// Check if user is owner
	if (member.role !== "owner") {
		throw new Error("Only owners can delete organizations");
	}

	// Delete all related data
	await prisma.$transaction(async (tx) => {
		// Delete all tasks
		await tx.task.deleteMany({
			where: { organizationId },
		});

		// Delete all columns
		await tx.column.deleteMany({
			where: { organizationId },
		});

		// Delete all members
		await tx.member.deleteMany({
			where: { organizationId },
		});

		// Delete all invitations
		await tx.invitation.deleteMany({
			where: { organizationId },
		});

		// Delete the organization
		await tx.organization.delete({
			where: { id: organizationId },
		});

		// Remove organization from all users
		const users = await tx.user.findMany({
			where: {
				organizationIds: {
					has: organizationId,
				},
			},
		});

		for (const user of users) {
			await tx.user.update({
				where: { id: user.id },
				data: {
					organizationIds: {
						set: user.organizationIds.filter((id) => id !== organizationId),
					},
				},
			});
		}
	});

	// If the deleted organization was the active one, clear it
	const session = await auth.api.getSession({ headers });
	if (session?.session?.activeOrganizationId === organizationId) {
		await auth.api.setActiveOrganization({
			body: {
				organizationId: null,
			},
			headers,
		});
	}

	return { success: true };
}
