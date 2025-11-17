import { apiClient } from "@/lib/client";
import { useQuery } from "@tanstack/react-query";
import { ProjectsQueryKeys } from "../../types";
import type { UserModel, ProjectsModel } from "@beroboard/db/types";

async function getProjectsService(): Promise<ProjectsModel[] | null> {
   const { data } = await apiClient.projects.get({
      query: {
         limit: 10,
      },
   });

   return data;
}

export async function useGetProjects() {
   const { data, isPending } = useQuery({
      queryKey: [ProjectsQueryKeys.GET_PROJECTS],
      queryFn: getProjectsService,
   });

   return {
      projects: data,
      isPending,
   };
}
