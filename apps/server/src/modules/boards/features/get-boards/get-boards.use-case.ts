import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import type { GetBoardsModel, GetBoardsResponseModel } from "./get-boards.model";
import { getBoardsRepository } from "./get-boards.repository";

export async function getBoardsUseCase(params: GetBoardsModel): Promise<GetBoardsResponseModel> {
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "project",
      resourceId: params.projectId,
      userId: params.userId,
      operation: "read",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to get boards for this project");
   }
   return await getBoardsRepository(params);
}
