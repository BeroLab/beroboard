import prisma from "@beroboard/db";
import type { AddUserToProjectModel } from "./add-user-to-project.model";

export async function addUserToProjectRepository(params: AddUserToProjectModel): Promise<void> {
   const project = await prisma.projects.findUnique({
      where: { id: params.id },
      select: { organizationId: true },
   });

   if (!project) {
      throw new Error("Project not found");
   }
   await prisma.member.upsert({
      where: {
         userId_organizationId: {
            userId: params.userId,
            organizationId: project.organizationId,
         },
      },
      create: {
         userId: params.userId,
         organizationId: project.organizationId,
         role: "user",
      },
      update: {},
   });
}
