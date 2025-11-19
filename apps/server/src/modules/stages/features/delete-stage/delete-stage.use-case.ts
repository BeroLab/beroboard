import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import { getStageRepository } from "../get-stage/get-stage.repository";
import type { DeleteStageModel } from "./delete-stage.model";
import { deleteStageRepository } from "./delete-stage.repository";

export async function deleteStageUseCase(params: DeleteStageModel): Promise<void> {
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "stage",
      resourceId: params.id,
      userId: params.userId,
      operation: "delete",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to delete this stage");
   }
   const stage = await getStageRepository(params);
   if (!stage) {
      throw new NotFoundError("Stage");
   }
   await deleteStageRepository(params);
}
