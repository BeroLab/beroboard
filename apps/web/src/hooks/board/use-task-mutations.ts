"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type {
	Column,
	CreateTaskInput,
	MoveTaskInput,
	Task,
	UpdateTaskInput,
} from "~/lib/types";
import { boardKeys } from "./keys";

export function useCreateTask(
	organizationId: string,
	options?: {
		onSuccess?: (task: Task) => void;
	},
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: CreateTaskInput) => {
			const { data, error } = await api.tasks.post({
				title: input.title,
				description: input.description,
				priority: input.priority ?? "NONE",
				dueDate: input.dueDate,
				labels: input.labels ?? [],
				columnId: input.columnId,
				assigneeId: input.assigneeId,
			});

			if (error) {
				throw new Error("Failed to create task");
			}

			return data as Task;
		},
		onSuccess: (task) => {
			queryClient.invalidateQueries({
				queryKey: boardKeys.columns(organizationId),
			});
			options?.onSuccess?.(task);
		},
	});
}

export function useUpdateTask(
	organizationId: string,
	options?: {
		onSuccess?: (task: Task) => void;
	},
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			input,
		}: {
			id: string;
			input: UpdateTaskInput;
		}) => {
			const { data, error } = await api.tasks({ id }).patch(input);

			if (error) {
				throw new Error("Failed to update task");
			}

			return data as Task;
		},
		onSuccess: (task) => {
			queryClient.invalidateQueries({
				queryKey: boardKeys.columns(organizationId),
			});
			options?.onSuccess?.(task);
		},
	});
}

export function useDeleteTask(
	organizationId: string,
	options?: {
		onSuccess?: (id: string) => void;
	},
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.tasks({ id }).delete();

			if (error) {
				throw new Error("Failed to delete task");
			}

			return id;
		},
		onSuccess: (id) => {
			queryClient.invalidateQueries({
				queryKey: boardKeys.columns(organizationId),
			});
			options?.onSuccess?.(id);
		},
	});
}

export function useMoveTask(
	organizationId: string,
	options?: {
		onSuccess?: (task: Task, input: MoveTaskInput) => void;
	},
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: MoveTaskInput) => {
			const { data, error } = await api.tasks.move.post(input);

			if (error) {
				throw new Error("Failed to move task");
			}

			return { task: data as Task, input };
		},
		onSuccess: ({ task, input }) => {
			// Update cache directly to avoid refetch flicker
			queryClient.setQueryData(
				boardKeys.columns(organizationId),
				(oldData: Column[] | undefined) => {
					if (!oldData) return oldData;

					return oldData.map((col) => {
						// Remove task from source column
						if (col.tasks.some((t) => t.id === input.taskId)) {
							return {
								...col,
								tasks: col.tasks.filter((t) => t.id !== input.taskId),
							};
						}
						// Add task to target column
						if (col.id === input.columnId) {
							const newTasks = [...col.tasks];
							const insertIndex = Math.min(input.order, newTasks.length);
							newTasks.splice(insertIndex, 0, task);
							return {
								...col,
								tasks: newTasks.map((t, idx) => ({ ...t, order: idx })),
							};
						}
						return col;
					});
				},
			);
			options?.onSuccess?.(task, input);
		},
	});
}

export function useReorderTasks(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			tasks: { id: string; order: number; columnId: string }[],
		) => {
			const { error } = await api.tasks.reorder.post({ tasks });

			if (error) {
				throw new Error("Failed to reorder tasks");
			}

			return tasks;
		},
		onSuccess: (reorderedTasks) => {
			// Update cache directly to avoid refetch flicker
			queryClient.setQueryData(
				boardKeys.columns(organizationId),
				(oldData: Column[] | undefined) => {
					if (!oldData) return oldData;

					const taskOrderMap = new Map(
						reorderedTasks.map((t) => [t.id, t.order]),
					);
					const columnId = reorderedTasks[0]?.columnId;

					return oldData.map((col) => {
						if (col.id === columnId) {
							const sortedTasks = [...col.tasks].sort((a, b) => {
								const orderA = taskOrderMap.get(a.id) ?? a.order;
								const orderB = taskOrderMap.get(b.id) ?? b.order;
								return orderA - orderB;
							});
							return {
								...col,
								tasks: sortedTasks.map((t, idx) => ({ ...t, order: idx })),
							};
						}
						return col;
					});
				},
			);
		},
	});
}