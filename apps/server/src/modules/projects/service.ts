import {
   addUserToProjectUseCase,
   createProjectUseCase,
   deleteProjectUseCase,
   getProjectsUseCase,
   getProjectUseCase,
   updateProjectUseCase,
   userBelongsToProjectUseCase,
} from "./features";

export const ProjectServiceImplementation = {
   create: createProjectUseCase,
   get: getProjectUseCase,
   getProjects: getProjectsUseCase,
   update: updateProjectUseCase,
   delete: deleteProjectUseCase,
   addUserToProject: addUserToProjectUseCase,
   userBelongsToProject: userBelongsToProjectUseCase,
};
