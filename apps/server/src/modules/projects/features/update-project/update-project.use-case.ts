import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import { getProjectRepository } from "../get-project/get-project.repository";
import type { UpdateProjectModel, UpdateProjectResponseModel } from "./update-project.model";
import { updateProjectRepository } from "./update-project.repository";

export async function updateProjectUseCase(params: UpdateProjectModel): Promise<UpdateProjectResponseModel> {
   const project = await getProjectRepository(params);
   if (!project) {
      throw new NotFoundError("Project");
   }
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "project",
      resourceId: project.id,
      userId: params.userId,
      operation: "write",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to update this project");
   }
   return await updateProjectRepository(params);
}
