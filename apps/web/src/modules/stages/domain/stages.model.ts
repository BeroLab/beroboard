import type { TaskApi } from "@/modules/task/domain/tasks.model";

export interface StagesApi {
   id: string;
   name: string;
   description: string;
   boardId: string;
   createdAt: Date;
   updatedAt: Date;
   deletedAt: Date | null;
   tasks: TaskApi[];
}
