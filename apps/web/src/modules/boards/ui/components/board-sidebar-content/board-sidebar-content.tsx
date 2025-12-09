import { CircuitBoard } from "lucide-react";
import Link from "next/link";
import { useGetBoardsByProject } from "@/modules/boards/services/get-boards-by-project";
import type { BoardSideBarContentProps } from "./types";

export function BoardSidebarContent({ projectId }: BoardSideBarContentProps) {
   const { boards } = useGetBoardsByProject({
      projectId,
   });
   return (
      <div>
         {boards?.map((board) => (
            <Link href={`/boards/${board.id}`} key={board.id}>
               <div className="flex cursor-pointer flex-row items-center gap-1 rounded-lg px-2 py-1 hover:bg-dracula-surface/25">
                  <CircuitBoard className="text-dracula-pink" size={20} />
                  <span className="font-semibold text-md">{board.name}</span>
               </div>
            </Link>
         ))}
      </div>
   );
}
