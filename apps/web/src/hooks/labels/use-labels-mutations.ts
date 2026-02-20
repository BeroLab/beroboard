import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type {
	CreateLabelInput,
	TaskLabel,
	UpdateLabelInput,
} from "~/lib/types";
import { labelsKeys } from "./keys";

export function useCreateLabel(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: CreateLabelInput) => {
			const { data, error } = await api.labels.post({
				text: input.text,
				color: input.color,
			});

			if (error) {
				throw new Error("Failed to create label");
			}

			return data as TaskLabel;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: labelsKeys.labels(organizationId),
			});
		},
	});
}

export function useDeleteLabel(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const { error } = await api.labels({ id }).delete();

			if (error) {
				throw new Error("Failed to delete label");
			}

			return id;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: labelsKeys.labels(organizationId),
			});
		},
	});
}

export function useUpdateLabel(organizationId: string) {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			input,
		}: {
			id: string;
			input: UpdateLabelInput;
		}) => {
			const { data, error } = await api.labels({ id }).patch(input);

			if (error) {
				throw new Error("Failed to update label");
			}

			return data as TaskLabel;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: labelsKeys.labels(organizationId),
			});
		},
	});
}
