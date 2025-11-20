"use client";

import { useFindBoardById } from "@/modules/boards/services/find-board-by-id";
import { BoardKanbanView } from "../../components/board-kanban-view";
import { BoardSelectViewSection } from "./components/board-select-view-section";
import type { BoardScreenProps } from "./types";

export function BoardScreen({ id }: BoardScreenProps) {
   const { board } = useFindBoardById({ id });
   return (
      <div className="w-full mt-5 flex flex-col h-full">
         <header className="px-8">
            <h1 className="font-bold text-3xl">{board?.name || "Loading..."}</h1>
         </header>
         <BoardSelectViewSection />
         {board && <BoardKanbanView boardId={board.id} />}
      </div>
   );
}
