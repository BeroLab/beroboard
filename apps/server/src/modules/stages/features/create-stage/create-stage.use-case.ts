import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import type { CreateStageModel, CreateStageResponseModel } from "./create-stage.model";
import { createStageRepository } from "./create-stage.repository";

export async function createStageUseCase(stage: CreateStageModel): Promise<CreateStageResponseModel> {
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "board",
      resourceId: stage.boardId,
      userId: stage.userId,
      operation: "create",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to create a stage for this board");
   }
   return await createStageRepository(stage);
}
