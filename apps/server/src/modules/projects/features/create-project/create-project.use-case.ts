import type { CreateProjectModel, CreateProjectResponseModel } from "./create-project.model";
import { createProjectRepository } from "./create-project.repository";

export async function createProjectUseCase(project: CreateProjectModel): Promise<CreateProjectResponseModel> {
   return await createProjectRepository(project);
}
