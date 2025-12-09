import { useQuery } from "@tanstack/react-query";
import { BoardQueryKeys } from "../../types";
import { findBoardByIdService } from "./find-board-by-id.service";

export function useFindBoardById({ id }: { id: string }) {
   const { data, error, isLoading } = useQuery({
      queryKey: [BoardQueryKeys.FIND_BOARD_BY_ID],
      queryFn: () => findBoardByIdService(id),
   });

   return {
      board: data,
      error,
      isLoading,
   };
}
