"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type {
	Column,
	CreateColumnInput,
	CreateTaskInput,
	MoveTaskInput,
	Task,
	UpdateColumnInput,
	UpdateTaskInput,
} from "~/lib/types";

const COLUMNS_KEY = "columns";

export function useColumns(organizationId: string) {
	return useQuery({
		queryKey: [COLUMNS_KEY, organizationId],
		queryFn: async () => {
			const { data, error } = await api.columns.get({
				query: { organizationId },
			});

			if (error) {
				throw new Error("Failed to fetch columns");
			}

			return (data ?? []) as Column[];
		},
		enabled: !!organizationId,
	});
}

export function useCreateTask(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: CreateTaskInput) => {
			const { data, error } = await api.tasks.post(input);

			if (error) {
				throw new Error("Failed to create task");
			}

			return data as Task;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [COLUMNS_KEY, organizationId],
			});
		},
	});
}

export function useUpdateTask(organizationId: string) {
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
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [COLUMNS_KEY, organizationId],
			});
		},
	});
}

export function useDeleteTask(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.tasks({ id }).delete();

			if (error) {
				throw new Error("Failed to delete task");
			}

			return { success: true };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [COLUMNS_KEY, organizationId],
			});
		},
	});
}

export function useMoveTask(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: MoveTaskInput) => {
			const { data, error } = await api.tasks.move.post(input);

			if (error) {
				throw new Error("Failed to move task");
			}

			return data as Task;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [COLUMNS_KEY, organizationId],
			});
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

			return { success: true };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [COLUMNS_KEY, organizationId],
			});
		},
	});
}

// Column mutations

export function useCreateColumn(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: CreateColumnInput) => {
			const { data, error } = await api.columns.post(input);

			if (error) {
				throw new Error("Failed to create column");
			}

			return data as Column;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [COLUMNS_KEY, organizationId],
			});
		},
	});
}

export function useUpdateColumn(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			input,
		}: {
			id: string;
			input: UpdateColumnInput;
		}) => {
			const { data, error } = await api.columns({ id }).patch(input);

			if (error) {
				throw new Error("Failed to update column");
			}

			return data as Column;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [COLUMNS_KEY, organizationId],
			});
		},
	});
}

export function useDeleteColumn(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.columns({ id }).delete();

			if (error) {
				throw new Error("Failed to delete column");
			}

			return { success: true };
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [COLUMNS_KEY, organizationId],
			});
		},
	});
}

export function useCreateDefaultColumns(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			columns: { name: string; color?: string; isCompleted?: boolean }[],
		) => {
			const results = await Promise.all(
				columns.map((col) =>
					api.columns.post({
						...col,
						organizationId,
					}),
				),
			);

			const errors = results.filter((r) => r.error);
			if (errors.length > 0) {
				throw new Error("Failed to create some columns");
			}

			return results.map((r) => r.data as Column);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [COLUMNS_KEY, organizationId],
			});
		},
	});
}
