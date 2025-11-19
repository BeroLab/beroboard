import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import type { GetStageModel, GetStageResponseModel } from "./get-stage.model";
import { getStageRepository } from "./get-stage.repository";

export async function getStageUseCase(params: GetStageModel): Promise<GetStageResponseModel> {
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "stage",
      resourceId: params.id,
      userId: params.userId,
      operation: "read",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to get this stage");
   }
   const stage = await getStageRepository(params);
   if (!stage) {
      throw new NotFoundError("Stage");
   }
   return stage;
}
