import { container } from "@/lib/dependency-injection/container";
import { ProjectService } from "@/modules/projects/interface";
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
   const projectService = container.resolve(ProjectService);
   const userBelongsToProject = await projectService.userBelongsToProject(board.projectId, params.userId);
   if (!userBelongsToProject) {
      throw new ForbiddenError("You are not allowed to update a board for this project");
   }
   return await updateBoardRepository(params);
}
