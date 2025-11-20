import { apiClient } from "@/lib/client";
import type { BoardApi } from "../../domain/board.model";

export async function getBoardByProjectService(projectID: string): Promise<BoardApi[] | null> {
   const { data } = await apiClient.boards.get({
      query: {
         projectId: projectID,
         limit: 10,
      },
   });

   return data;
}
