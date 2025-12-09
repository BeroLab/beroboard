import { apiClient } from "@/lib/client";

export type FindProjectQuery = {
   id: string;
};

export async function findProjectByIdService(query: FindProjectQuery) {
   const { data } = await apiClient
      .projects({
         id: query.id,
      })
      .get();

   return data;
}
