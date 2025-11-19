import prisma from "@beroboard/db";
import type { CreateStageModel } from "./create-stage.model";

export async function createStageRepository(stage: CreateStageModel) {
   const newStage = await prisma.stages.create({
      data: {
         name: stage.name,
         description: stage.description,
         boardId: stage.boardId,
      },
   });
   return newStage;
}
