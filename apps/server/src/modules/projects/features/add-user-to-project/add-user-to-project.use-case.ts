import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import { getProjectRepository } from "../get-project/get-project.repository";
import type { AddUserToProjectModel } from "./add-user-to-project.model";
import { addUserToProjectRepository } from "./add-user-to-project.repository";

export async function addUserToProjectUseCase(params: AddUserToProjectModel): Promise<void> {
   const project = await getProjectRepository({ id: params.id, userId: params.ownerId });
   if (!project) {
      throw new NotFoundError("Project");
   }
   if (project.createdByUserId !== params.ownerId) throw new ForbiddenError("You are not allowed to add a user to this project");
   await addUserToProjectRepository(params);
}
