import prisma from "@beroboard/db";
import type { UpdateProjectModel } from "./update-project.model";

export async function updateProjectRepository(project: UpdateProjectModel) {
   const updatedProject = await prisma.projects.update({
      where: { id: project.id },
      data: {
         name: project.name,
         description: project.description,
      },
   });
   return updatedProject;
}
