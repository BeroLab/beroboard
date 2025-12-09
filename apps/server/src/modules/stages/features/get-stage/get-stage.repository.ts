import prisma from "@beroboard/db";
import type { GetStageModel } from "./get-stage.model";

export async function getStageRepository(params: GetStageModel) {
   return prisma.stages.findFirst({
      where: {
         id: params.id,
      },
      include: {
         tasks: true,
      },
   });
}
