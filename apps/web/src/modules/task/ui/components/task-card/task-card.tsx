import { Clock, MessageSquare } from 'lucide-react'

interface TaskCardProps {
  title: string
  category: string
  logTime?: string
  commentsCount?: number
  assignee?: {
    name: string
    avatar?: string
    initials?: string
  }
}

export function TaskCard({
  title,
  category,
  logTime,
  commentsCount = 0,
  assignee
}: TaskCardProps) {
  return (
    <div className="bg-dracula-surface/40 rounded-lg border border-dracula-surface/30 p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex gap-3">
        {/* Checkbox */}
        <div className="pt-0.5">
          <button
            className="w-5 h-5 rounded-full border-2 border-dracula-surface hover:border-dracula-purple transition-colors"
            aria-label="Mark task as complete"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h4 className="text-sm font-medium text-dracula-foreground mb-2">
            {title}
          </h4>

          {/* Category Tag */}
          <span className="inline-block text-xs text-dracula-foreground/60 bg-dracula-surface px-2 py-1 rounded mb-3">
            {category}
          </span>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs text-dracula-foreground/50">
              {/* Log Time */}
              {logTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Log: {logTime}</span>
                </div>
              )}

              {/* Comments */}
              {commentsCount > 0 && (
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{commentsCount}</span>
                </div>
              )}
            </div>

            {/* Assignee Avatar */}
            {assignee && (
              <div className="flex items-center justify-center w-7 h-7 rounded-full bg-dracula-surface text-xs font-medium text-dracula-foreground/70">
                {assignee.avatar ? (
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{assignee.initials || assignee.name.substring(0, 2).toUpperCase()}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
