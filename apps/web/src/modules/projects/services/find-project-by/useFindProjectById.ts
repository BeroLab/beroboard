import { useQuery } from "@tanstack/react-query";
import { findProjectByIdService, type FindProjectQuery } from "./find-project-by-id.service";
import { ProjectsQueryKeys } from "../../types";

export function useFindProjectById({ id }: FindProjectQuery) {
   const { data, isPending } = useQuery({
      queryKey: [ProjectsQueryKeys.FIND_PROJECT_BY_ID, id],
      queryFn: () => findProjectByIdService({ id }),
   });

   return {
      project: data,
      isPending,
   };
}
