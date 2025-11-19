import { apiClient } from "@/lib/client";

type FindProjectQuery = {
   id: string;
};

export async function findProjectByService(query: FindProjectQuery) {
   const {data} = await apiClient
      .projects({
         id: query.id,
      })
      .get();

   return data;
}
