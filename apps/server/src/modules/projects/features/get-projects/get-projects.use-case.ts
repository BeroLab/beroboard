import type { GetProjectsModel, GetProjectsResponseModel } from "./get-projects.model";
import { getProjectsRepository } from "./get-projects.repository";

export async function getProjectsUseCase(params: GetProjectsModel): Promise<GetProjectsResponseModel> {
   return await getProjectsRepository(params);
}
