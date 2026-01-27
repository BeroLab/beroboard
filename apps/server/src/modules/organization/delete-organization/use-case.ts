import { prisma } from "@blaboard/db";
import { auth } from "@blaboard/auth";
import type { DeleteOrganizationParams } from "./schemas";

export async function deleteOrganizationUseCase(
	params: DeleteOrganizationParams,
	headers: Headers,
) {
	const { organizationId } = params;

	await prisma.$transaction(async (tx) => {
		await tx.task.deleteMany({
			where: { organizationId },
		});

		await tx.column.deleteMany({
			where: { organizationId },
		});
	});

	await auth.api.deleteOrganization({
		body: {
			organizationId,
		},
		headers,
	});

	return { success: true };
}
