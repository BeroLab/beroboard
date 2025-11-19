import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import type { GetBoardModel, GetBoardResponseModel } from "./get-board.model";
import { getBoardRepository } from "./get-board.repository";

export async function getBoardUseCase(params: GetBoardModel): Promise<GetBoardResponseModel> {
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "board",
      resourceId: params.id,
      userId: params.userId,
      operation: "read",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to get this board");
   }
   const board = await getBoardRepository(params);
   if (!board) {
      throw new NotFoundError("Board");
   }

   return board;
}
