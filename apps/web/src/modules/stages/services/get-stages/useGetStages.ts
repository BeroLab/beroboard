import { useQuery } from "@tanstack/react-query";
import { StageQueryKeys } from "../../types";
import { getStagesService } from "./get-stages.service";

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
