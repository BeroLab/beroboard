import { container } from "@/lib/dependency-injection/container";
import { PermissionService } from "@/modules/permissions/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import { getBoardRepository } from "../get-board/get-board.repository";
import type { DeleteBoardModel } from "./delete-board.model";
import { deleteBoardRepository } from "./delete-board.repository";
export async function deleteBoardUseCase(params: DeleteBoardModel): Promise<void> {
   const permissionService = container.resolve(PermissionService);
   const userCanAccessResource = await permissionService.userCanAccessResource({
      resourceType: "board",
      resourceId: params.id,
      userId: params.userId,
      operation: "delete",
   });
   if (!userCanAccessResource) {
      throw new ForbiddenError("You are not allowed to delete this board");
   }
   const board = await getBoardRepository({ id: params.id, userId: params.userId });
   if (!board) {
      throw new NotFoundError("Board");
   }
   await deleteBoardRepository(params);
}
