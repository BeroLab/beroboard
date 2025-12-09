import { useGetStages } from "@/modules/stages/services/get-stages";
import { StageColumnView } from "@/modules/stages/ui/components/stages-column-view";
import { TaskCard } from "@/modules/task/ui/components/task-card";
import type { BoardKanbanViewProps } from "./types";

export function BoardKanbanView({ boardId }: BoardKanbanViewProps) {
   const { stages, isLoading } = useGetStages(boardId);

   if (isLoading) {
      return <div>Loading...</div>;
   }

   return (
      <div className="flex h-full gap-6 overflow-x-auto px-6">
         {stages?.map((stage) => (
            <StageColumnView key={stage.id} stage={stage} renderTaskContent={(task) => <TaskCard key={task.id} title={task.title} category={"normal"} />} />
         ))}
      </div>
   );
}
