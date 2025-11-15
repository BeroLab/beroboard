import { container } from "@/lib/dependency-injection/container";
import { ProjectService } from "@/modules/projects/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import { getBoardRepository } from "../get-board/get-board.repository";
import type { DeleteBoardModel } from "./delete-board.model";
import { deleteBoardRepository } from "./delete-board.repository";
export async function deleteBoardUseCase(params: DeleteBoardModel): Promise<void> {
   const board = await getBoardRepository({ id: params.id, userId: params.userId });
   if (!board) {
      throw new NotFoundError("Board");
   }
   const projectService = container.resolve(ProjectService);
   const userBelongsToProject = await projectService.userBelongsToProject(params.projectId, params.userId);
   if (!userBelongsToProject) {
      throw new ForbiddenError("You are not allowed to delete a board for this project");
   }
   await deleteBoardRepository(params);
}
