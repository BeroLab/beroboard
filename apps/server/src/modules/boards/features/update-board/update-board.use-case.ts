import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import { getBoardRepository } from "../get-board/get-board.repository";
import type { UpdateBoardModel, UpdateBoardResponseModel } from "./update-board.model";
import { updateBoardRepository } from "./update-board.repository";

export async function updateBoardUseCase(params: UpdateBoardModel): Promise<UpdateBoardResponseModel> {
   const board = await getBoardRepository(params);
   if (!board) {
      throw new NotFoundError("Board");
   }
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "board",
      resourceId: params.id,
      userId: params.userId,
      operation: "write",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to update a board for this project");
   }
   return await updateBoardRepository(params);
}
