import prisma from "@beroboard/db";
import type { GetProjectModel } from "./get-project.model";

export async function getProjectRepository(params: GetProjectModel) {
   return prisma.projects.findFirst({
      where: {
         id: params.id,
      },
   });
}
