"use client";

import {
	closestCorners,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import {
	useColumns,
	useCreateColumn,
	useCreateDefaultColumns,
	useCreateTask,
	useDeleteColumn,
	useMoveTask,
	useReorderTasks,
} from "~/hooks/use-board";
import type { Column, CreateTaskInput, Task } from "~/lib/types";
import { DEFAULT_COLUMNS } from "~/lib/types";
import { AddColumn } from "./add-column";
import { BoardHeader } from "./board-header";
import { CreateTaskModal } from "./create-task-modal";
import { DraggableTaskCard } from "./draggable-task-card";
import { EmptyBoard } from "./empty-board";
import { KanbanColumn } from "./kanban-column";
import { Sidebar } from "./sidebar";

interface TaskBoardProps {
	organizationId: string;
	userId: string;
}

function filterColumns(columns: Column[], query: string): Column[] {
	if (!query.trim()) return columns;
	const lowerQuery = query.toLowerCase();

	return columns.map((column) => ({
		...column,
		tasks: column.tasks.filter(
			(task) =>
				task.title.toLowerCase().includes(lowerQuery) ||
				task.description?.toLowerCase().includes(lowerQuery) ||
				task.labels?.some((label) =>
					label.text.toLowerCase().includes(lowerQuery),
				),
		),
	}));
}

export function TaskBoard({ organizationId, userId }: TaskBoardProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeTask, setActiveTask] = useState<Task | null>(null);

	const { data: columns = [], isLoading, error } = useColumns(organizationId);
	const createTaskMutation = useCreateTask(organizationId);
	const createColumnMutation = useCreateColumn(organizationId);
	const deleteColumnMutation = useDeleteColumn(organizationId);
	const createDefaultColumnsMutation = useCreateDefaultColumns(organizationId);
	const moveTaskMutation = useMoveTask(organizationId);
	const reorderTasksMutation = useReorderTasks(organizationId);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	const filteredColumns = useMemo(
		() => filterColumns(columns, searchQuery),
		[columns, searchQuery],
	);

	const totalTasks = useMemo(
		() => filteredColumns.reduce((acc, col) => acc + col.tasks.length, 0),
		[filteredColumns],
	);

	const findColumnByTaskId = useCallback(
		(taskId: string): Column | undefined => {
			return columns.find((col) =>
				col.tasks.some((task) => task.id === taskId),
			);
		},
		[columns],
	);

	const handleDragStart = useCallback(
		(event: DragStartEvent) => {
			const { active } = event;
			const taskId = active.id as string;

			const column = findColumnByTaskId(taskId);
			if (column) {
				const task = column.tasks.find((t) => t.id === taskId);
				if (task) {
					setActiveTask(task);
				}
			}
		},
		[findColumnByTaskId],
	);

	const handleDragOver = useCallback((event: DragOverEvent) => {
		// Visual feedback is handled by the column's isOver state
	}, []);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active, over } = event;
			setActiveTask(null);

			if (!over) return;

			const activeId = active.id as string;
			const overId = over.id as string;

			const activeColumn = findColumnByTaskId(activeId);
			if (!activeColumn) return;

			// Check if dropped on a column
			const overColumn = columns.find((col) => col.id === overId);
			// Or dropped on a task
			const overTaskColumn = findColumnByTaskId(overId);

			const targetColumn = overColumn || overTaskColumn;
			if (!targetColumn) return;

			// Same column - reorder
			if (activeColumn.id === targetColumn.id) {
				const activeIndex = activeColumn.tasks.findIndex(
					(t) => t.id === activeId,
				);
				const overIndex = overColumn
					? activeColumn.tasks.length // Drop at end if on column
					: activeColumn.tasks.findIndex((t) => t.id === overId);

				if (activeIndex !== overIndex && overIndex !== -1) {
					const newTasks = arrayMove(
						activeColumn.tasks,
						activeIndex,
						overIndex,
					);
					const reorderedTasks = newTasks.map((task, index) => ({
						id: task.id,
						order: index,
						columnId: activeColumn.id,
					}));

					try {
						await reorderTasksMutation.mutateAsync(reorderedTasks);
					} catch {
						toast.error("Failed to reorder tasks");
					}
				}
			} else {
				// Different column - move task
				const overIndex = overColumn
					? targetColumn.tasks.length // Drop at end if on column
					: targetColumn.tasks.findIndex((t) => t.id === overId);

				try {
					await moveTaskMutation.mutateAsync({
						taskId: activeId,
						columnId: targetColumn.id,
						order: overIndex === -1 ? targetColumn.tasks.length : overIndex,
					});
					toast.success("Task moved successfully");
				} catch {
					toast.error("Failed to move task");
				}
			}
		},
		[columns, findColumnByTaskId, moveTaskMutation, reorderTasksMutation],
	);

	const handleCreateTask = async (
		input: Omit<CreateTaskInput, "organizationId" | "createdById">,
	) => {
		try {
			await createTaskMutation.mutateAsync({
				...input,
				organizationId,
				createdById: userId,
			});
			toast.success("Task created successfully");
		} catch {
			toast.error("Failed to create task");
		}
	};

	const handleCreateColumn = async (name: string) => {
		try {
			await createColumnMutation.mutateAsync({
				name,
				organizationId,
			});
			toast.success("Column created successfully");
		} catch {
			toast.error("Failed to create column");
		}
	};

	const handleDeleteColumn = async (id: string) => {
		const column = columns.find((c) => c.id === id);
		if (column && column.tasks.length > 0) {
			toast.error(
				"Cannot delete column with tasks. Move or delete tasks first.",
			);
			return;
		}

		try {
			await deleteColumnMutation.mutateAsync(id);
			toast.success("Column deleted successfully");
		} catch {
			toast.error("Failed to delete column");
		}
	};

	const handleCreateDefaultColumns = async () => {
		try {
			await createDefaultColumnsMutation.mutateAsync([...DEFAULT_COLUMNS]);
			toast.success("Default columns created successfully");
		} catch {
			toast.error("Failed to create default columns");
		}
	};

	if (isLoading) {
		return (
			<div className="flex h-screen items-center justify-center bg-[#0B0B0E]">
				<div className="text-[#6B6B70]">Loading board...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-screen items-center justify-center bg-[#0B0B0E]">
				<div className="text-[#E85A4F]">{error.message}</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen overflow-hidden bg-[#0B0B0E]">
			<Sidebar />

			{/* Main Content */}
			<main className="flex flex-1 flex-col gap-6 overflow-hidden p-6">
				<BoardHeader
					title="Project Overview"
					subtitle={`${totalTasks} tasks · ${columns.length} columns`}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					onNewTask={() => setIsModalOpen(true)}
				/>

				{/* Board Area */}
				{columns.length === 0 ? (
					<EmptyBoard
						onCreateDefaultColumns={handleCreateDefaultColumns}
						isLoading={createDefaultColumnsMutation.isPending}
					/>
				) : (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCorners}
						onDragStart={handleDragStart}
						onDragOver={handleDragOver}
						onDragEnd={handleDragEnd}
					>
						<div className="flex flex-1 gap-4 overflow-x-auto pb-4">
							{filteredColumns.map((column) => (
								<KanbanColumn
									key={column.id}
									column={column}
									onDelete={handleDeleteColumn}
								/>
							))}
							<AddColumn
								onAdd={handleCreateColumn}
								isLoading={createColumnMutation.isPending}
							/>
						</div>

						<DragOverlay>
							{activeTask && (
								<DraggableTaskCard
									task={activeTask}
									isCompleted={
										findColumnByTaskId(activeTask.id)?.isCompleted ?? false
									}
								/>
							)}
						</DragOverlay>
					</DndContext>
				)}
			</main>

			{/* Create Task Modal */}
			<CreateTaskModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				columns={columns}
				onSubmit={handleCreateTask}
			/>
		</div>
	);
}
