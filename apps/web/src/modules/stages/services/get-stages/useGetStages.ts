import { useQuery } from "@tanstack/react-query";
import { getStagesService } from "./get-stages.service";
import { StageQueryKeys } from "../../types";

export function useGetStages(boardID: string) {
   const { data, isLoading } = useQuery({
      queryKey: [StageQueryKeys.GET_STAGES, boardID],
      queryFn: () => getStagesService(boardID),
   });

   return {
      stages: data,
      isLoading,
   };
}
