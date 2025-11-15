import prisma from "@beroboard/db";
import type { DeleteProjectModel } from "./delete-project.model";

export async function deleteProjectRepository(params: DeleteProjectModel) {
   return prisma.projects.update({
      where: { id: params.id },
      data: {
         deletedAt: new Date(),
      },
   });
}
