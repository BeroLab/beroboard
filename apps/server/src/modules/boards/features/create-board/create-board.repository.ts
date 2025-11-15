import prisma from "@beroboard/db";
import type { CreateBoardModel } from "./create-board.model";

export async function createBoardRepository(board: CreateBoardModel) {
   const newBoard = await prisma.boards.create({
      data: {
         name: board.name,
         description: board.description,
         projectId: board.projectId,
      },
   });
   return newBoard;
}
