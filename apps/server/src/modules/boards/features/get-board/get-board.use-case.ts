import { container } from "@/lib/dependency-injection/container";
import { ProjectService } from "@/modules/projects/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import type { GetBoardModel, GetBoardResponseModel } from "./get-board.model";
import { getBoardRepository } from "./get-board.repository";

export async function getBoardUseCase(params: GetBoardModel): Promise<GetBoardResponseModel> {
   const projectService = container.resolve(ProjectService);
   const board = await getBoardRepository(params);
   if (!board) {
      throw new NotFoundError("Board");
   }
   const userBelongsToProject = await projectService.userBelongsToProject(board.projectId, params.userId);
   if (!userBelongsToProject) {
      throw new ForbiddenError("You are not allowed to get a board for this project");
   }
   return board;
}
