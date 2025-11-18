import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/client";
import type { ProjectApi } from "../../domain/project.model";
import { ProjectsQueryKeys } from "../../types";

async function getProjectsService(): Promise<ProjectApi[] | null> {
   const { data } = await apiClient.projects.get({
      query: {
         limit: 10,
      },
   });

   return data;
}

export function useGetProjects() {
   const { data, isPending } = useQuery({
      queryKey: [ProjectsQueryKeys.GET_PROJECTS],
      queryFn: getProjectsService,
   });

   return {
      projects: data,
      isPending,
   };
}
