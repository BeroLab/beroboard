import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
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
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "project",
      resourceId: project.id,
      userId: params.userId,
      operation: "delete",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to delete this project");
   }
   await deleteProjectRepository(params);
}
