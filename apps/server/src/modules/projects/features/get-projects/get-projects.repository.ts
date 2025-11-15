import prisma from "@beroboard/db";
import type { GetProjectsModel } from "./get-projects.model";

export async function getProjectsRepository(params: GetProjectsModel) {
   return prisma.projects.findMany({
      where: {
         name: {
            contains: params.title,
         },
         description: {
            contains: params.description,
         },
         createdAt: {
            gte: params.createdAt,
         },
         updatedAt: {
            gte: params.updatedAt,
         },
      },
      orderBy: {
         createdAt: "desc",
      },
      take: params.limit,
      cursor: params.cursor
         ? {
              id: params.cursor,
           }
         : undefined,
   });
}
