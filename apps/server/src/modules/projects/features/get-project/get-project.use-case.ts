import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import { userBelongsToProjectUseCase } from "../user-belongs-to-project";
import type { GetProjectModel, GetProjectResponseModel } from "./get-project.model";
import { getProjectRepository } from "./get-project.repository";

export async function getProjectUseCase(params: GetProjectModel) {
   const project = await getProjectRepository(params);
   if (!project) {
      throw new NotFoundError("Project");
   }
   const userBelongsToProject = await userBelongsToProjectUseCase(project.id, params.userId);
   if (!userBelongsToProject) {
      throw new ForbiddenError("You are not allowed to get this project");
   }

   return project;
}
