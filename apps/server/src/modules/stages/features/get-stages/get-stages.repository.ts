import prisma from "@beroboard/db";
import type { GetStagesModel } from "./get-stages.model";

export async function getStagesRepository(params: GetStagesModel) {
   return prisma.stages.findMany({
      where: {
         name: {
            contains: params.name,
         },
         description: {
            contains: params.description,
         },
         boardId: params.boardId,
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
      include: {
         tasks: true,
      },
   });
}

