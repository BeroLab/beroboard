import prisma from "@blaboard/db";
import type {
	CreateColumnInput,
	ReorderColumnsInput,
	UpdateColumnInput,
} from "./schema";

export async function createColumn(input: CreateColumnInput) {
	const lastColumn = await prisma.column.findFirst({
		where: { organizationId: input.organizationId },
		orderBy: { order: "desc" },
	});

	return prisma.column.create({
		data: {
			name: input.name,
			color: input.color,
			order: lastColumn ? lastColumn.order + 1 : 0,
			isCompleted: input.isCompleted ?? false,
			organizationId: input.organizationId,
		},
	});
}

export async function updateColumn(id: string, input: UpdateColumnInput) {
	return prisma.column.update({
		where: { id },
		data: {
			name: input.name,
			color: input.color,
			order: input.order,
			isCompleted: input.isCompleted,
		},
	});
}

export async function deleteColumn(id: string) {
	await prisma.column.delete({ where: { id } });
	return { success: true };
}

export async function reorderColumns(input: ReorderColumnsInput) {
	const updates = input.columns.map((col) =>
		prisma.column.update({
			where: { id: col.id },
			data: { order: col.order },
		}),
	);
	await prisma.$transaction(updates);
	return { success: true };
}
