import type { UpdateProjectModel, UpdateProjectResponseModel } from "./update-project.model";
import { updateProjectRepository } from "./update-project.repository";

export async function updateProjectUseCase(params: UpdateProjectModel): Promise<UpdateProjectResponseModel> {
   return await updateProjectRepository(params);
}
