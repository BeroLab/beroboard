"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type { Column } from "~/lib/types";
import { boardKeys } from "./keys";

export function useColumns(organizationId: string) {
	return useQuery({
		queryKey: boardKeys.columns(organizationId),
		queryFn: async () => {
			const { data, error } = await api.columns.get();

			if (error) {
				throw new Error("Failed to fetch columns");
			}

			return (data ?? []) as Column[];
		},
		enabled: !!organizationId,
	});
}