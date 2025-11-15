import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import { getProjectRepository } from "../get-project/get-project.repository";
import type { DeleteProjectModel } from "./delete-project.model";
import { deleteProjectRepository } from "./delete-project.repository";

export async function deleteProjectUseCase(params: DeleteProjectModel): Promise<void> {
   const project = await getProjectRepository(params);
   if (!project) {
      throw new NotFoundError("Project");
   }
   if (project.createdByUserId !== params.userId) throw new ForbiddenError("You are not allowed to delete this project");
   await deleteProjectRepository(params);
}
