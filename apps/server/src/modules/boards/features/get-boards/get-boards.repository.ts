import prisma from "@beroboard/db";
import type { GetBoardsModel } from "./get-boards.model";

export async function getBoardsRepository(params: GetBoardsModel) {
   return prisma.boards.findMany({
      where: {
         ...(params.name && {
            name: {
               contains: params.name,
            },
         }),
         ...(params.description && {
            description: {
               contains: params.description,
            },
         }),
         ...(params.createdAt && {
            createdAt: {
               gte: params.createdAt,
            },
         }),
         ...(params.updatedAt && {
            updatedAt: {
               gte: params.updatedAt,
            },
         }),
         projectId: params.projectId,
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
