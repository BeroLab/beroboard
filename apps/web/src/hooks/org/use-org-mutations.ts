"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { authClient } from "~/lib/auth-client";
import type { CreateOrganizationInput, Organization } from "~/lib/types";
import { organizationKeys } from "./keys";

export function useCreateOrganization() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (input: CreateOrganizationInput) => {
			const { data, error } = await api.organizations.post({
				name: input.name,
				description: input.description || "",
			});

			if (error) {
				throw new Error("Failed to create organization");
			}

			return data as Organization;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: organizationKeys.all,
			});
		},
	});
}

export function useSetActiveOrganization() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (organizationId: string) => {
			const { data, error } = await api.organizations.active.patch({
				organizationId,
			});

			if (error) {
				throw new Error("Failed to set active organization");
			}

			return data;
		},
		onSuccess: async () => {
			await authClient.getSession({ fetchOptions: { cache: "no-cache" } });
			
			queryClient.invalidateQueries();
		},
	});
}

export function useDeleteOrganization() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (organizationId: string) => {
			const { data, error } = await api.organizations({ organizationId }).delete();

			if (error) {
				throw new Error("Failed to delete organization");
			}

			return data;
		},
		onSuccess: async () => {
			await authClient.getSession({ fetchOptions: { cache: "no-cache" } });
			
			queryClient.invalidateQueries({
				queryKey: organizationKeys.all,
			});
		},
	});
}
