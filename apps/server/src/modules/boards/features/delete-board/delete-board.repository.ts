import prisma from "@beroboard/db";
import type { DeleteBoardModel } from "./delete-board.model";

export async function deleteBoardRepository(params: DeleteBoardModel) {
   return prisma.boards.delete({
      where: { id: params.id },
   });
}
