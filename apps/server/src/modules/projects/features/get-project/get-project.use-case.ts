import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import type { GetProjectModel } from "./get-project.model";
import { getProjectRepository } from "./get-project.repository";

export async function getProjectUseCase(params: GetProjectModel) {
   const project = await getProjectRepository(params);
   if (!project) {
      throw new NotFoundError("Project");
   }
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "project",
      resourceId: project.id,
      userId: params.userId,
      operation: "read",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to get this project");
   }
   return project;
}
