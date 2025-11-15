import { container } from "@/lib/dependency-injection/container";
import { ProjectService } from "@/modules/projects/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import { NotFoundError } from "@/shared/errors/not-found.error";
import type { CreateBoardModel, CreateBoardResponseModel } from "./create-board.model";
import { createBoardRepository } from "./create-board.repository";

export async function createBoardUseCase(board: CreateBoardModel): Promise<CreateBoardResponseModel> {
   const projectsService = container.resolve(ProjectService);

   // Get project to check existence and access
   // If user doesn't have access, getProjectUseCase will throw ForbiddenError
   // We catch it and re-throw with board-specific message
   try {
      const project = await projectsService.get({ id: board.projectId, userId: board.userId });
      if (!project) {
         throw new NotFoundError("Project");
      }
      if (project.createdByUserId !== board.userId) {
         throw new ForbiddenError("You are not allowed to create a board for this project");
      }
      return await createBoardRepository(board);
   } catch (error) {
      // If it's a ForbiddenError from getProjectUseCase (user doesn't belong to project),
      // re-throw with board-specific message
      if (error instanceof ForbiddenError && error.message === "You are not allowed to get this project") {
         throw new ForbiddenError("You are not allowed to create a board for this project");
      }
      // Re-throw other errors as-is
      throw error;
   }
}
