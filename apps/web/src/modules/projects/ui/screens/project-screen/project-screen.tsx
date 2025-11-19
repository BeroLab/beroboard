"use client";
import { BoardKanbanView } from "@/modules/boards/ui/components/board-kanban-view";
import { ProjectSelectViewSection } from "./components/project-select-view-section";
import type { ProjectScreenProps } from "./types";
import { useFindProjectById } from "@/modules/projects/services/find-project-by";

export function ProjectScreen({ id }: ProjectScreenProps) {
   const { project } = useFindProjectById({ id });
   return (
      <div className="w-full mt-5 flex flex-col h-full">
         <header className="px-8">
            <h1 className="font-bold text-3xl">{project?.name || "Loading..."}</h1>
         </header>
         <ProjectSelectViewSection />
         <BoardKanbanView />
      </div>
   );
}
