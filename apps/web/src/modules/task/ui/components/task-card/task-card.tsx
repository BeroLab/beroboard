import { Clock, MessageSquare } from "lucide-react";

interface TaskCardProps {
   title: string;
   category: string;
   logTime?: string;
   commentsCount?: number;
   assignee?: {
      name: string;
      avatar?: string;
      initials?: string;
   };
}

export function TaskCard({ title, category, logTime, commentsCount = 0, assignee }: TaskCardProps) {
   return (
      <div className="cursor-pointer rounded-lg border border-dracula-surface/30 bg-dracula-surface/40 p-4 transition-shadow hover:shadow-md">
         <div className="flex gap-3">
            {/* Checkbox */}
            <div className="pt-0.5">
               <button
                  type="button"
                  className="h-5 w-5 rounded-full border-2 border-dracula-surface transition-colors hover:border-dracula-purple"
                  aria-label="Mark task as complete"
               />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
               {/* Title */}
               <h4 className="mb-2 font-medium text-dracula-foreground text-sm">{title}</h4>

               {/* Category Tag */}
               <span className="mb-3 inline-block rounded bg-dracula-surface px-2 py-1 text-dracula-foreground/60 text-xs">{category}</span>

               {/* Footer */}
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-dracula-foreground/50 text-xs">
                     {/* Log Time */}
                     {logTime && (
                        <div className="flex items-center gap-1">
                           <Clock className="h-3.5 w-3.5" />
                           <span>Log: {logTime}</span>
                        </div>
                     )}

                     {/* Comments */}
                     {commentsCount > 0 && (
                        <div className="flex items-center gap-1">
                           <MessageSquare className="h-3.5 w-3.5" />
                           <span>{commentsCount}</span>
                        </div>
                     )}
                  </div>

                  {/* Assignee Avatar */}
                  {assignee && (
                     <div className="flex h-7 w-7 items-center justify-center rounded-full bg-dracula-surface font-medium text-dracula-foreground/70 text-xs">
                        {assignee.avatar ? (
                           <img src={assignee.avatar} alt={assignee.name} className="h-full w-full rounded-full object-cover" />
                        ) : (
                           <span>{assignee.initials || assignee.name.substring(0, 2).toUpperCase()}</span>
                        )}
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
