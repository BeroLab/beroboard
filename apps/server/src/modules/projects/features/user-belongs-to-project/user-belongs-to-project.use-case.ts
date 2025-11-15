import { userBelongsToProjectRepository } from "./user-belongs-to-project.repository";

export async function userBelongsToProjectUseCase(projectId: string, userId: string): Promise<boolean> {
   return await userBelongsToProjectRepository(projectId, userId);
}
