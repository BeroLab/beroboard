import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import type { CreateBoardModel, CreateBoardResponseModel } from "./create-board.model";
import { createBoardRepository } from "./create-board.repository";

export async function createBoardUseCase(board: CreateBoardModel): Promise<CreateBoardResponseModel> {
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "project",
      resourceId: board.projectId,
      userId: board.userId,
      operation: "create",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to create a board for this project");
   }
   return await createBoardRepository(board);
}
