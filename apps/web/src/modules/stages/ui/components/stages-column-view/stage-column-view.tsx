import { MoreHorizontal, Plus } from "lucide-react";
import type { StageColumnViewProps } from "./types";

export function StageColumnView({ stage, renderTaskContent }: StageColumnViewProps) {
   return (
      <div key={stage.id} className="flex w-[360px] min-w-[360px] flex-col border-dracula-surface/30 border-r">
         {/* Column Header */}
         <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
               <h3 className="font-semibold text-sm">{stage.name}</h3>
               <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-dracula-surface px-2 font-medium text-xs">
                  {stage.tasks.length}
               </span>
            </div>

            <div className="flex items-center gap-1">
               <button
                  type="button"
                  className="rounded p-1.5 text-gray-500 transition-colors hover:bg-dracula-surface/25"
                  aria-label={`Add item to ${stage.name}`}
               >
                  <Plus className="w-4 h-4" />
               </button>
               <button
                  type="button"
                  className="rounded p-1.5 text-gray-500 transition-colors hover:bg-dracula-surface/25"
                  aria-label={`More options for ${stage.name}`}
               >
                  <MoreHorizontal className="w-4 h-4" />
               </button>
            </div>
         </div>

         {/* Column Content Area */}
         <div className="flex-1 space-y-3 overflow-y-auto p-4">{stage.tasks?.map((task) => renderTaskContent(task))}</div>
      </div>
   );
}
