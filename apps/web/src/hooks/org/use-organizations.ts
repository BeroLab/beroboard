"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type { Organization } from "~/lib/types";
import { organizationKeys } from "./keys";

export function useOrganizations() {
	return useQuery({
		queryKey: organizationKeys.all,
		queryFn: async () => {
			const { data, error } = await api.organizations.get();

			if (error) {
				throw new Error("Failed to fetch organizations");
			}

			return (data ?? []) as Organization[];
		},
	});
}
