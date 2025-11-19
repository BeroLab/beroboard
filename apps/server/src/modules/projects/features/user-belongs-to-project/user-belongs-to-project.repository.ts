import prisma from "@beroboard/db";

export async function userBelongsToProjectRepository(projectId: string, userId: string): Promise<boolean> {
   const project = await prisma.projects.findUnique({
      where: { id: projectId },
      select: { organizationId: true },
   });

   if (!project) return false;

   const member = await prisma.member.findUnique({
      where: {
         userId_organizationId: {
            userId,
            organizationId: project.organizationId,
         },
      },
   });

   return !!member;
}
