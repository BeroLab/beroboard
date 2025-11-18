import type { ProjectApi } from "../../domain/project.model";

export interface CreateProjectDTO {
   name: ProjectApi["name"];
   description: ProjectApi["description"];
}
