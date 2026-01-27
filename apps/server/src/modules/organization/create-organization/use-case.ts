import { auth } from "@blaboard/auth";
import { prisma } from "@blaboard/db";
import { ConflictError } from "@/shared/errors/conflict.error";
import type { CreateOrganizationInput } from "./schemas";

export async function createOrganizationUseCase(
	input: CreateOrganizationInput,
	headers: Headers,
) {
	const slug = input.name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	const existingOrg = await prisma.organization.findUnique({
		where: { slug },
	});

	if (existingOrg) {
		throw new ConflictError({
			message: "An organization with this name already exists on this account",
		});
	}

	const organization = await auth.api.createOrganization({
		body: {
			name: input.name,
			slug,
			metadata: input.description ? { description: input.description } : undefined,
		},
		headers,
	});

	return organization;
}
