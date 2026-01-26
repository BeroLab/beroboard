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
import {
	arrayMove,
	horizontalListSortingStrategy,
	SortableContext,
} from "@dnd-kit/sortable";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
	useColumns,
	useCreateColumn,
	useCreateDefaultColumns,
	useCreateTask,
	useDeleteColumn,
	useMoveTask,
	useReorderColumns,
	useReorderTasks,
	useUpdateColumn,
} from "~/hooks/board";
import type {
	Column,
	CreateTaskInput,
	Task,
	UpdateColumnInput,
} from "~/lib/types";
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
	const [activeColumn, setActiveColumn] = useState<Column | null>(null);
	const [localColumns, setLocalColumns] = useState<Column[]>([]);

	const dragStartState = useRef<{
		columnId: string;
		taskIndex: number;
	} | null>(null);

	const columnDragStartIndex = useRef<number | null>(null);

	const isPendingMutation = useRef(false);

	const lastMoveRef = useRef<{ taskId: string; columnId: string } | null>(null);
	const prevColumnsRef = useRef<string>("");

	const { data: columns = [], isLoading, error } = useColumns(organizationId);
	const createTaskMutation = useCreateTask(organizationId);
	const createColumnMutation = useCreateColumn(organizationId);
	const updateColumnMutation = useUpdateColumn(organizationId);
	const deleteColumnMutation = useDeleteColumn(organizationId);
	const createDefaultColumnsMutation = useCreateDefaultColumns(organizationId);
	const moveTaskMutation = useMoveTask(organizationId);
	const reorderTasksMutation = useReorderTasks(organizationId);
	const reorderColumnsMutation = useReorderColumns(organizationId);

	useEffect(() => {
		const columnsJson = JSON.stringify(columns);
		if (
			!activeTask &&
			!activeColumn &&
			!isPendingMutation.current &&
			prevColumnsRef.current !== columnsJson
		) {
			prevColumnsRef.current = columnsJson;
			setLocalColumns(columns);
		}
	}, [columns, activeTask, activeColumn]);

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

	const columnIds = useMemo(
		() => localColumns.map((col) => `column-${col.id}`),
		[localColumns],
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
			const activeId = active.id as string;
			const activeData = active.data.current;

			lastMoveRef.current = null;

			if (activeData?.type === "column-sortable") {
				const column = activeData.column as Column;
				setActiveColumn(column);
				columnDragStartIndex.current = localColumns.findIndex(
					(c) => c.id === column.id,
				);
				return;
			}

			const column = findColumnByTaskId(activeId);
			if (column) {
				const taskIndex = column.tasks.findIndex((t) => t.id === activeId);
				const task = column.tasks[taskIndex];
				if (task) {
					setActiveTask(task);
				}
			}
		},
		[findColumnByTaskId, localColumns],
	);

	const handleDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;
			if (!over) return;

			const activeData = active.data.current;

			if (activeData?.type === "column-sortable") {
				const overData = over.data.current;

				if (overData?.type === "column-sortable") {
					const activeColumnId = (activeData.column as Column).id;
					const overColumnId = (overData.column as Column).id;

					if (activeColumnId !== overColumnId) {
						setLocalColumns((currentColumns) => {
							const oldIndex = currentColumns.findIndex(
								(c) => c.id === activeColumnId,
							);
							const newIndex = currentColumns.findIndex(
								(c) => c.id === overColumnId,
							);

							if (oldIndex !== -1 && newIndex !== -1) {
								return arrayMove(currentColumns, oldIndex, newIndex);
							}
							return currentColumns;
						});
					}
				}
				return;
			}

			if (!activeTask) return;

			const activeId = active.id as string;
			const overId = over.id as string;

			if (activeId === overId) return;

			const overData = over.data.current;
			const isOverColumn = overData?.type === "column";
			const isOverTask = overData?.type === "task";

			if (!isOverColumn && !isOverTask) return;

			setLocalColumns((currentColumns) => {
				const sourceColIndex = currentColumns.findIndex((col) =>
					col.tasks.some((t) => t.id === activeId),
				);
				if (sourceColIndex === -1) return currentColumns;

				let targetColIndex: number;
				if (isOverColumn) {
					targetColIndex = currentColumns.findIndex((col) => col.id === overId);
				} else {
					targetColIndex = currentColumns.findIndex((col) =>
						col.tasks.some((t) => t.id === overId),
					);
				}
				if (targetColIndex === -1) return currentColumns;

				if (sourceColIndex === targetColIndex) {
					return currentColumns;
				}

				const targetColumnId = currentColumns[targetColIndex].id;

				if (
					lastMoveRef.current?.taskId === activeId &&
					lastMoveRef.current?.columnId === targetColumnId
				) {
					return currentColumns;
				}

				const sourceCol = currentColumns[sourceColIndex];
				const activeTaskIndex = sourceCol.tasks.findIndex(
					(t) => t.id === activeId,
				);
				if (activeTaskIndex === -1) return currentColumns;

				const task = sourceCol.tasks[activeTaskIndex];

				const insertIndex = isOverColumn
					? currentColumns[targetColIndex].tasks.length
					: currentColumns[targetColIndex].tasks.findIndex(
							(t) => t.id === overId,
						);

				lastMoveRef.current = { taskId: activeId, columnId: targetColumnId };

				const newColumns = [...currentColumns];

				newColumns[sourceColIndex] = {
					...newColumns[sourceColIndex],
					tasks: newColumns[sourceColIndex].tasks.filter(
						(t) => t.id !== activeId,
					),
				};

				const targetTasks = [...newColumns[targetColIndex].tasks];
				targetTasks.splice(insertIndex === -1 ? 0 : insertIndex, 0, task);
				newColumns[targetColIndex] = {
					...newColumns[targetColIndex],
					tasks: targetTasks,
				};

				return newColumns;
			});
		},
		[activeTask],
	);

	const handleDragEnd = useCallback(
		async (event: DragEndEvent) => {
			const { active } = event;
			const activeData = active.data.current;

			isPendingMutation.current = true;

			if (activeData?.type === "column-sortable") {
				const startIndex = columnDragStartIndex.current;
				setActiveColumn(null);
				columnDragStartIndex.current = null;

				if (startIndex === null) {
					isPendingMutation.current = false;
					setLocalColumns(columns);
					return;
				}

				const column = activeData.column as Column;
				const currentIndex = localColumns.findIndex((c) => c.id === column.id);

				if (currentIndex !== startIndex) {
					const reorderedColumns = localColumns.map((col, index) => ({
						id: col.id,
						order: index,
					}));

					try {
						await reorderColumnsMutation.mutateAsync(reorderedColumns);
						toast.success("Columns reordered successfully");
					} catch {
						toast.error("Failed to reorder columns");
						setLocalColumns(columns);
					}
				}

				isPendingMutation.current = false;
				return;
			}

			const startState = dragStartState.current;

			setActiveTask(null);

			if (!startState) {
				isPendingMutation.current = false;
				setLocalColumns(columns);
				return;
			}

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
		[
			columns,
			localColumns,
			moveTaskMutation,
			reorderTasksMutation,
			reorderColumnsMutation,
		],
	);

	const handleDragCancel = useCallback(() => {
		setActiveTask(null);
		setActiveColumn(null);
		dragStartState.current = null;
		columnDragStartIndex.current = null;
		isPendingMutation.current = false;
		lastMoveRef.current = null;
		setLocalColumns(columns);
	}, [columns]);

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

	const handleCreateColumn = async (name: string, color?: string) => {
		try {
			await createColumnMutation.mutateAsync({
				name,
				color,
				organizationId,
			});
			toast.success("Column created successfully");
		} catch {
			toast.error("Failed to create column");
		}
	};

	const handleUpdateColumn = async (id: string, input: UpdateColumnInput) => {
		try {
			await updateColumnMutation.mutateAsync({ id, input });
			toast.success("Column updated successfully");
		} catch {
			toast.error("Failed to update column");
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
			<div className="flex h-screen items-center justify-center bg-background">
				<div className="text-muted-foreground">Loading board...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex h-screen items-center justify-center bg-background">
				<div className="text-destructive">{error.message}</div>
			</div>
		);
	}

	return (
		<div className="flex h-screen overflow-hidden bg-background">
			<Sidebar />

			<main className="flex flex-1 flex-col gap-5 overflow-hidden p-5">
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
						<SortableContext
							items={columnIds}
							strategy={horizontalListSortingStrategy}
						>
							<div className="flex flex-1 gap-4 overflow-x-auto pb-4">
								{filteredColumns.map((column) => (
									<KanbanColumn
										key={column.id}
										column={column}
										onDelete={handleDeleteColumn}
										onUpdate={handleUpdateColumn}
									/>
								))}
								<AddColumn
									onAdd={handleCreateColumn}
									isLoading={createColumnMutation.isPending}
								/>
							</div>
						</SortableContext>

						<DragOverlay>
							{activeTask && (
								<div className="rotate-1 scale-[1.02] cursor-grabbing opacity-95 shadow-lg">
									<DraggableTaskCard
										task={activeTask}
										isCompleted={
											findColumnByTaskId(activeTask.id)?.isCompleted ?? false
										}
									/>
								</div>
							)}
							{activeColumn && (
								<div className="w-64 rotate-1 scale-[1.02] cursor-grabbing rounded-lg border border-border/50 bg-card/80 p-3 opacity-95 shadow-lg backdrop-blur-sm">
									<div className="flex items-center gap-2 pb-2">
										{activeColumn.color && (
											<div
												className="size-2 rounded-full"
												style={{ backgroundColor: activeColumn.color }}
											/>
										)}
										<span className="font-medium text-foreground text-sm">
											{activeColumn.name}
										</span>
										<span className="text-muted-foreground text-xs">
											{activeColumn.tasks.length}
										</span>
									</div>
									<div className="flex min-h-[60px] items-center justify-center rounded-lg bg-accent/30 text-muted-foreground text-xs">
										{activeColumn.tasks.length} tasks
									</div>
								</div>
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
