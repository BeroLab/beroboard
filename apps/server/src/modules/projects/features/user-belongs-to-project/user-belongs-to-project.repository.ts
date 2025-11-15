import prisma from "@beroboard/db";

export async function userBelongsToProjectRepository(projectId: string, userId: string): Promise<boolean> {
   return !!(await prisma.projects.findFirst({
      where: {
         id: projectId,
         usersSubscribed: {
            some: { id: userId },
         },
      },
   }));
}
