import prisma from "@beroboard/db";
import type { DeleteStageModel } from "./delete-stage.model";

export async function deleteStageRepository(params: DeleteStageModel) {
   return prisma.stages.update({
      where: { id: params.id },
      data: {
         deletedAt: new Date(),
      },
   });
}
