import type { GetProjectsModel } from "./get-projects.model";
import { getProjectsRepository } from "./get-projects.repository";

export async function getProjectsUseCase(params: GetProjectsModel) {
   return await getProjectsRepository(params);
}
