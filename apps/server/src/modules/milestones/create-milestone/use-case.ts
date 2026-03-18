import { prisma } from "@blaboard/db";
import type { CreateMilestonesInput } from "./schemas";

export async function createMilestone(
	organizationId: string,
	input: CreateMilestonesInput,
) {
	return prisma.milestone.create({
		data: {
			name: input.name,
			description: input.description,
			status: input.status,
			startDate: input.startDate,
			endDate: input.endDate,
			organizationId,
		},
	});
}
