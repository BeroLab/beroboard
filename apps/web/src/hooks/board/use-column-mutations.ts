"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type { Column, CreateColumnInput, UpdateColumnInput } from "~/lib/types";
import { boardKeys } from "./keys";

export function useCreateColumn(
	organizationId: string,
	options?: {
		onSuccess?: (column: Column) => void;
	},
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: CreateColumnInput) => {
			const { data, error } = await api.columns.post({
				name: input.name,
				color: input.color,
				isCompleted: input.isCompleted ?? false,
			});

			if (error) {
				throw new Error("Failed to create column");
			}

			return data as Column;
		},
		onSuccess: (column) => {
			queryClient.invalidateQueries({
				queryKey: boardKeys.columns(organizationId),
			});
			options?.onSuccess?.(column);
		},
	});
}

export function useUpdateColumn(
	organizationId: string,
	options?: {
		onSuccess?: (column: Column) => void;
	},
) {
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
		onSuccess: (column) => {
			queryClient.invalidateQueries({
				queryKey: boardKeys.columns(organizationId),
			});
			options?.onSuccess?.(column);
		},
	});
}

export function useDeleteColumn(
	organizationId: string,
	options?: {
		onSuccess?: (id: string) => void;
	},
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.columns({ id }).delete();

			if (error) {
				throw new Error("Failed to delete column");
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

export function useReorderColumns(
	organizationId: string,
	options?: {
		onSuccess?: (columns: { id: string; order: number }[]) => void;
	},
) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (columns: { id: string; order: number }[]) => {
			const { error } = await api.columns.reorder.post({ columns });

			if (error) {
				throw new Error("Failed to reorder columns");
			}

			return columns;
		},
		onSuccess: (columns) => {
			queryClient.invalidateQueries({
				queryKey: boardKeys.columns(organizationId),
			});
			options?.onSuccess?.(columns);
		},
	});
}

export function useCreateDefaultColumns(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (
			columns: { name: string; color?: string; isCompleted?: boolean }[],
		) => {
			const results: Column[] = [];
			for (const col of columns) {
				const { data, error } = await api.columns.post({
					name: col.name,
					color: col.color,
					isCompleted: col.isCompleted ?? false,
				});

				if (error) {
					throw new Error("Failed to create column");
				}

				results.push(data as Column);
			}

			return results;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: boardKeys.columns(organizationId),
			});
		},
	});
}