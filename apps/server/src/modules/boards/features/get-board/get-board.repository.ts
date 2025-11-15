import prisma from "@beroboard/db";
import type { GetBoardModel } from "./get-board.model";

export async function getBoardRepository(params: GetBoardModel) {
   return prisma.boards.findFirst({
      where: {
         id: params.id,
         project: {
            usersSubscribed: {
               some: { id: params.userId },
            },
         },
      },
   });
}
