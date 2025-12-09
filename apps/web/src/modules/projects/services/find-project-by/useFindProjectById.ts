import { useQuery } from "@tanstack/react-query";
import { ProjectsQueryKeys } from "../../types";
import { type FindProjectQuery, findProjectByIdService } from "./find-project-by-id.service";

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
