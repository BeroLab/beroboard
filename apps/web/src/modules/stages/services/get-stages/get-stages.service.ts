import { apiClient } from "@/lib/client";
import type { StagesApi } from "../../domain/stages.model";

export async function getStagesService(boardID: string): Promise<StagesApi[] | null> {
   const { data } = await apiClient.stages.get({
      query: {
         boardId: boardID,
         limit: 10,
      },
   });

   return data?.reverse() || null;
}
