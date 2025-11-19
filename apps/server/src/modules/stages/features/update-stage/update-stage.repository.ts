import prisma from "@beroboard/db";
import type { UpdateStageModel } from "./update-stage.model";

export async function updateStageRepository(stage: UpdateStageModel) {
   const updatedStage = await prisma.stages.update({
      where: { id: stage.id },
      data: {
         name: stage.name,
         description: stage.description,
      },
   });
   return updatedStage;
}

