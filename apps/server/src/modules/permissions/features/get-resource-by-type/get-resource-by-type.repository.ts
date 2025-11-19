import prisma from "@beroboard/db";
import { NotFoundError } from "@/shared/errors/not-found.error";
import type { ResourceType } from "./get-resource-by-type.model";

export async function getProjectIdFromResourceRepository(resourceType: ResourceType, resourceId: string): Promise<string | undefined> {
   switch (resourceType) {
      case "project": {
         const project = await prisma.projects.findUnique({
            where: { id: resourceId },
         });
         if (!project) throw new NotFoundError("Project");
         return project.id;
      }
      case "board": {
         const board = await prisma.boards.findUnique({
            where: { id: resourceId },
         });
         if (!board) throw new NotFoundError("Board");
         return board.projectId;
      }
      case "stage": {
         const stage = await prisma.stages.findUnique({
            where: { id: resourceId },
            select: { board: { select: { projectId: true } } },
         });
         if (!stage) throw new NotFoundError("Stage");
         return stage.board.projectId;
      }
      case "task": {
         const task = await prisma.tasks.findUnique({
            where: { id: resourceId },
            select: { stage: { select: { board: { select: { projectId: true } } } } },
         });
         if (!task) throw new NotFoundError("Task");
         return task.stage.board.projectId;
      }
      default:
         return undefined;
   }
}
