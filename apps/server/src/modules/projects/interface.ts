import { container } from "@/lib/dependency-injection/container";
import { createToken } from "@/lib/dependency-injection/token";
import type {
   AddUserToProjectModel,
   CreateProjectModel,
   CreateProjectResponseModel,
   DeleteProjectModel,
   GetProjectModel,
   GetProjectResponseModel,
   GetProjectsModel,
   GetProjectsResponseModel,
   UpdateProjectModel,
   UpdateProjectResponseModel,
} from "./features";
import { ProjectServiceImplementation } from "./service";

interface ProjectServiceType {
   create: (project: CreateProjectModel) => Promise<CreateProjectResponseModel>;
   get: (params: GetProjectModel) => Promise<GetProjectResponseModel>;
   getProjects: (query: GetProjectsModel) => Promise<GetProjectsResponseModel>;
   update: (params: UpdateProjectModel) => Promise<UpdateProjectResponseModel>;
   delete: (params: DeleteProjectModel) => Promise<void>;
   addUserToProject: (params: AddUserToProjectModel) => Promise<void>;
   userBelongsToProject: (projectId: string, userId: string) => Promise<boolean>;
}

export const ProjectService = createToken<ProjectServiceType>("ProjectService");
container.register(ProjectService, ProjectServiceImplementation);
