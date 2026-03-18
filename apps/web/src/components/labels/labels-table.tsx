import { DotsThreeIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
	useCreateLabel,
	useDeleteLabel,
	useUpdateLabel,
} from "~/hooks/labels/use-labels-mutations";
import { useLabels } from "~/hooks/use-labels";
import type {
	CreateLabelInput,
	TaskLabel,
	UpdateLabelInput,
} from "~/lib/types";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CreateLabelModal } from "./create-label-modal";
import { DeleteLabelModal } from "./delete-label-modal";
import { EditLabelModal } from "./edit-label-modal";
import { LabelsHeader } from "./labels-header";

interface LabelsTableProps {
	organizationId: string;
}

export function LabelsTable({ organizationId }: LabelsTableProps) {
	const { data: labels } = useLabels(organizationId);
	const [searchQuery, setSearchQuery] = useState("");
	const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);
	const [labelToEdit, setLabelToEdit] = useState<TaskLabel | null>(null);

	const deleteLabelMutation = useDeleteLabel(organizationId);
	const createLabelMutation = useCreateLabel(organizationId);
	const updateLabelMutation = useUpdateLabel(organizationId);

	const filteredLabels = useMemo(() => {
		if (!labels) return [];

		return labels.filter((label) =>
			label.text.toLowerCase().includes(searchQuery.toLowerCase()),
		);
	}, [labels, searchQuery]);

	const handleCreateLabel = async (
		input: Omit<CreateLabelInput, "organizationId">,
	) => {
		try {
			await createLabelMutation.mutateAsync({
				...input,
				organizationId,
			});
			toast.success("Label created successfully");
		} catch {
			toast.error("Failed to create label");
		}
	};

	const handleDeleteLabel = async (id: string) => {
		try {
			await deleteLabelMutation.mutateAsync(id);
			toast.success("Label deleted successfully");
		} catch {
			toast.error("Failed to delete label");
		}
	};

	const handleEditLabel = async (id: string, input: UpdateLabelInput) => {
		try {
			await updateLabelMutation.mutateAsync({
				id,
				input,
			});
			toast.success("Label updated successfully");
		} catch {
			toast.error("Failed to update label");
		}
	};

	function formatDate(date: Date | string | null): string {
		if (!date) return "Not set";
		const d = new Date(date);
		return d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	}

	return (
		<div className="flex h-screen bg-background">
			<main className="flex flex-1 flex-col gap-5 overflow-hidden p-5">
				<LabelsHeader
					title="Labels"
					subtitle={`${filteredLabels?.length ?? 0} Labels`}
					onNewLabel={() => setIsCreateModalOpen(true)}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
				/>

				<div className="flex-1 overflow-auto">
					{" "}
					<table className="w-full">
						<thead className="border-border border-b">
							<tr>
								<th className="px-5 py-3 text-left font-semibold text-muted-foreground text-sm">
									Name
								</th>
								<th className="px-5 py-3 text-left font-semibold text-muted-foreground text-sm">
									Created
								</th>
								<th className="px-5 py-3 text-left font-semibold text-muted-foreground text-sm">
									Updated
								</th>
							</tr>
						</thead>
						<tbody>
							{filteredLabels?.map((label) => {
								return (
									<tr
										className="group h-14 border-border border-b transition-colors last:border-b-0 hover:bg-secondary/30"
										key={label.id}
									>
										<td className="flex items-center gap-2 px-5 py-3">
											<span
												className="inline-block h-3 w-3 rounded-full"
												style={{ backgroundColor: `${label.color}` }}
											/>
											<span className="font-medium text-foreground">
												{label.text}
											</span>
										</td>

										<td className="px-5 py-3 text-muted-foreground text-sm">
											{formatDate(label.createdAt)}
										</td>

										<td className="px-5 py-3 text-muted-foreground text-sm">
											{formatDate(label.updatedAt)}
										</td>

										<td className="min-w-24 px-5 py-3 text-right">
											<DropdownMenu>
												<DropdownMenuTrigger
													render={
														<Button
															variant="ghost"
															size="sm"
															className="rounded-sm text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100 data-open:bg-secondary data-open:opacity-100"
														>
															<DotsThreeIcon className="size-5" />
														</Button>
													}
												/>
												<DropdownMenuContent align="end" className="rounded-sm">
													<DropdownMenuItem
														onClick={(e) => {
															e.preventDefault();
															setLabelToEdit(label);
															setIsEditModalOpen(true);
														}}
														variant="default"
													>
														<PencilIcon className="size-5" />
														<span>Edit</span>
													</DropdownMenuItem>

													<DropdownMenuItem
														variant="destructive"
														onClick={(e) => {
															e.stopPropagation();
															setSelectedLabelId(label.id);
															setIsDeleteModalOpen(true);
														}}
													>
														<TrashIcon className="size-5" />
														<span>Delete</span>
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</main>

			<CreateLabelModal
				isOpen={isCreateModalOpen}
				onClose={() => setIsCreateModalOpen(false)}
				onSubmit={handleCreateLabel}
			/>

			<DeleteLabelModal
				labelId={selectedLabelId}
				onSubmit={handleDeleteLabel}
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedLabelId(null);
				}}
			/>

			<EditLabelModal
				label={labelToEdit}
				onSubmit={handleEditLabel}
				isOpen={isEditModalOpen}
				onClose={() => {
					setIsEditModalOpen(false);
				}}
			/>
		</div>
	);
}
