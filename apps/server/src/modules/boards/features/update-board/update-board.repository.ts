import prisma from "@beroboard/db";
import type { UpdateBoardModel } from "./update-board.model";

export async function updateBoardRepository(board: UpdateBoardModel) {
   const updatedBoard = await prisma.boards.update({
      where: { id: board.id },
      data: {
         name: board.name,
         description: board.description,
      },
   });
   return updatedBoard;
}
