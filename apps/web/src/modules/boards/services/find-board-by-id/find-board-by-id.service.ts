import { apiClient } from "@/lib/client";
import type { BoardApi } from "../../domain/board.model";

export async function findBoardByIdService(boardId: string): Promise<BoardApi | null> {
   const { data } = await apiClient
      .boards({
         id: boardId,
      })
      .get();
   return data;
}
