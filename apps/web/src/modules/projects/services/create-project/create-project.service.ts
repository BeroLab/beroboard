import { apiClient } from "@/lib/client";
import type { ProjectApi } from "../../domain/project.model";
import type { CreateProjectDTO } from "./types";

export async function createProjectService({ name, description }: CreateProjectDTO): Promise<ProjectApi | null> {
   const { data } = await apiClient.projects.post({
      name,
      description,
   });

   return data as unknown as ProjectApi;
}
