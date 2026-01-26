"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "~/lib/api";
import type { TaskWithDetails } from "~/lib/types";
import { boardKeys } from "./keys";

export function useTask(taskId: string) {
	return useQuery({
		queryKey: boardKeys.task(taskId),
		queryFn: async () => {
			const { data, error } = await api.tasks({ id: taskId }).get();

			if (error) {
				throw new Error("Failed to fetch task");
			}

			return data as TaskWithDetails;
		},
		enabled: !!taskId,
	});
}
