import prisma from "@beroboard/db";
import type { CreateProjectModel } from "./create-project.model";

export async function createProjectRepository(project: CreateProjectModel) {
   const newProject = await prisma.projects.create({
      data: {
         name: project.name,
         description: project.description,
         createdByUserId: project.userId,
         usersSubscribed: { connect: { id: project.userId } },
      },
   });
   return newProject;
}
