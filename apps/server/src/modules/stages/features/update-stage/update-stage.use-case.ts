import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import { getStageRepository } from "../get-stage/get-stage.repository";
import type { UpdateStageModel, UpdateStageResponseModel } from "./update-stage.model";
import { updateStageRepository } from "./update-stage.repository";

export async function updateStageUseCase(params: UpdateStageModel): Promise<UpdateStageResponseModel> {
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "stage",
      resourceId: params.id,
      userId: params.userId,
      operation: "write",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to update this stage");
   }
   const stage = await getStageRepository(params);
   if (!stage) {
      throw new NotFoundError("Stage");
   }
   return await updateStageRepository(params);
}
