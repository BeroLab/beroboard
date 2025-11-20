import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBoardService } from "./create-board.service";
import type { MutationProps } from "@/shared/config/types";
import type { CreateBoardDTO } from "./types";
import { BoardQueryKeys } from "../../types";

export function useCreateBoard({ onError, onSuccess }: MutationProps<void>) {
   const queryClient = useQueryClient();
   const { mutate, isPending } = useMutation<{ projectID: string }, Error, CreateBoardDTO>({
      mutationFn: (variables) => createBoardService(variables),
      onSuccess: (data) => {
         queryClient.invalidateQueries({
            queryKey: [BoardQueryKeys.GET_BOARDS_BY_PROJECT, data.projectID],
         });
         onSuccess?.();
      },
      onError,
   });

   return { createBoard: mutate, isPending };
}
