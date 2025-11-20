import { useQuery } from "@tanstack/react-query";
import { BoardQueryKeys } from "../../types";
import { getBoardByProjectService } from "./get-board-by-project.service";

type Props = {
   projectId: string;
};

export function useGetBoardsByProject({ projectId }: Props) {
   const { data, isPending } = useQuery({
      queryKey: [BoardQueryKeys.GET_BOARDS_BY_PROJECT, projectId],
      queryFn: () => getBoardByProjectService(projectId),
   });
   return {
      boards: data,
      isPending,
   };
}
