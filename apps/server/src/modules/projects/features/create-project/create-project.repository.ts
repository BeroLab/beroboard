import prisma from "@beroboard/db";
import type { CreateProjectModel } from "./create-project.model";

export async function createProjectRepository(project: CreateProjectModel & { organizationId: string }) {
   const newProject = await prisma.projects.create({
      data: {
         name: project.name,
         description: project.description,
         createdByUserId: project.userId,
         organizationId: project.organizationId,
      },
   });
   return newProject;
}
