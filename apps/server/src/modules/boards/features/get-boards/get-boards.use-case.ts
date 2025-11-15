import { container } from "@/lib/dependency-injection/container";
import { ProjectService } from "@/modules/projects/interface";
import { ForbiddenError } from "@/shared/errors/forbidden-error";
import type { GetBoardsModel, GetBoardsResponseModel } from "./get-boards.model";
import { getBoardsRepository } from "./get-boards.repository";

export async function getBoardsUseCase(params: GetBoardsModel): Promise<GetBoardsResponseModel> {
   const projectsService = container.resolve(ProjectService);
   const userBelongsToProject = await projectsService.userBelongsToProject(params.projectId, params.userId);
   if (!userBelongsToProject) {
      throw new ForbiddenError("You are not allowed to get boards for this project");
   }
   return await getBoardsRepository(params);
}
