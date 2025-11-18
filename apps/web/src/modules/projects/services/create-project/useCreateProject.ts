import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationProps } from "@/shared/config/types";
import type { ProjectApi } from "../../domain/project.model";
import { ProjectsQueryKeys } from "../../types";
import { createProjectService } from "./create-project.service";
import type { CreateProjectDTO } from "./types";

export function useCreateProject({ onSuccess, onError }: MutationProps<ProjectApi>) {
   const queryClient = useQueryClient();
   const { mutate, isPending } = useMutation<ProjectApi | null, Error, CreateProjectDTO>({
      mutationFn: (variables) => createProjectService(variables),
      onSuccess: (data) => {
         onSuccess?.(data);
         queryClient.invalidateQueries({
            queryKey: [ProjectsQueryKeys.GET_PROJECTS],
         });
      },
      onError,
   });

   return {
      createProject: mutate,
      isPending,
   };
}
