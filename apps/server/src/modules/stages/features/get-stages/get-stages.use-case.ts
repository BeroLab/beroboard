import { container } from "@/lib/dependency-injection/container";
import { BoardService } from "@/modules/boards/interface";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import type { GetStagesModel, GetStagesResponseModel } from "./get-stages.model";
import { getStagesRepository } from "./get-stages.repository";

export async function getStagesUseCase(params: GetStagesModel): Promise<GetStagesResponseModel> {
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "board",
      resourceId: params.boardId,
      userId: params.userId,
      operation: "read",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to get stages for this board");
   }
   return await getStagesRepository(params);
}
