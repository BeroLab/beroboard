import { container } from "@/lib/dependency-injection/container";
import { createToken } from "@/lib/dependency-injection/token";
import * as features from "./features";

interface ProjectServiceType {
   create: (project: features.CreateProjectModel) => Promise<features.CreateProjectResponseModel>;
   get: (params: features.GetProjectModel) => Promise<features.GetProjectResponseModel>;
   getProjects: (query: features.GetProjectsModel) => Promise<features.GetProjectsResponseModel>;
   update: (params: features.UpdateProjectModel) => Promise<features.UpdateProjectResponseModel>;
   delete: (params: features.DeleteProjectModel) => Promise<void>;
   addUserToProject: (params: features.AddUserToProjectModel) => Promise<void>;
   userBelongsToProject: (projectId: string, userId: string) => Promise<boolean>;
}
export const ProjectServiceImplementation: ProjectServiceType = {
   create: features.createProjectUseCase,
   get: features.getProjectUseCase,
   getProjects: features.getProjectsUseCase,
   update: features.updateProjectUseCase,
   delete: features.deleteProjectUseCase,
   addUserToProject: features.addUserToProjectUseCase,
   userBelongsToProject: features.userBelongsToProjectUseCase,
};

export const ProjectService = createToken<ProjectServiceType>("ProjectService");
container.register(ProjectService, ProjectServiceImplementation);
