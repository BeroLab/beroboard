import prisma from "@beroboard/db";
import { NotFoundError } from "@/shared/errors/not-found.error";
import type { ResourceType } from "../get-resource-by-type/get-resource-by-type.model";

export async function getOrganizationIdFromResourceRepository(resourceType: ResourceType, resourceId: string): Promise<string | undefined> {
   switch (resourceType) {
      case "project": {
         const project = await prisma.projects.findUnique({
            where: { id: resourceId },
            select: { organizationId: true },
         });
         if (!project) throw new NotFoundError("Project");
         return project.organizationId;
      }
      case "board": {
         const board = await prisma.boards.findUnique({
            where: { id: resourceId },
            select: { project: { select: { organizationId: true } } },
         });
         if (!board) throw new NotFoundError("Board");
         return board.project.organizationId;
      }
      case "stage": {
         const stage = await prisma.stages.findUnique({
            where: { id: resourceId },
            select: { board: { select: { project: { select: { organizationId: true } } } } },
         });
         if (!stage) throw new NotFoundError("Stage");
         return stage.board.project.organizationId;
      }
      case "task": {
         const task = await prisma.tasks.findUnique({
            where: { id: resourceId },
            select: {
               stage: {
                  select: {
                     board: {
                        select: {
                           project: {
                              select: { organizationId: true },
                           },
                        },
                     },
                  },
               },
            },
         });
         if (!task) throw new NotFoundError("Task");
         return task.stage.board.project.organizationId;
      }
      default:
         return undefined;
   }
}
