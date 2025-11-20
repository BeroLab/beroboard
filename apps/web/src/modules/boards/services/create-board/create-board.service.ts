import { apiClient } from "@/lib/client";
import type { CreateBoardDTO } from "./types";

export async function createBoardService(dto: CreateBoardDTO) {
   const { data } = await apiClient.boards.post(
      {
         description: dto.description || "",
         name: dto.name,
      },
      {
         query: {
            projectId: dto.projectId,
         },
      },
   );

   if (data && dto.stages && dto.stages.length > 0) {
      for (const stage of dto.stages) {
         console.log("Creating stage:", stage);
         await apiClient.stages.post({
            boardId: data.id,
            name: stage,
            description: "",
         });
      }
   }

   return {
      projectID: dto.projectId,
   };
}
