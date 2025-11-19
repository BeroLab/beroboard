import { Plus, MoreHorizontal } from 'lucide-react'
import { TaskCard } from '@/modules/task/ui/components/task-card/task-card'

interface Task {
  id: string
  title: string
  category: string
  logTime?: string
  commentsCount?: number
  assignee?: {
    name: string
    initials?: string
    avatar?: string
  }
}

interface KanbanColumn {
  id: string
  title: string
  tasks: Task[]
}

export function BoardKanbanView() {
  const columns: KanbanColumn[] = [
    {
      id: 'backlog',
      title: 'Backlog',
      tasks: [
        {
          id: '1',
          title: 'Planning a new version of the tutorial process',
          category: 'UX Design',
          logTime: '-',
          commentsCount: 1,
          assignee: {
            name: 'Michael Green',
            initials: 'MG'
          }
        }
      ]
    },
    {
      id: 'todo',
      title: 'Todo',
      tasks: []
    },
    {
      id: 'in-progress',
      title: 'In progress',
      tasks: [
        {
          id: '2',
          title: 'A new prototype for the onboarding process',
          category: 'UI Design',
          logTime: '3h 05min',
          commentsCount: 3,
          assignee: {
            name: 'Michael Green',
            initials: 'MG'
          }
        },
        {
          id: '3',
          title: 'Implementation of new icons to the system design',
          category: 'Design System',
          logTime: '-',
          commentsCount: 1,
          assignee: {
            name: 'User',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop'
          }
        },
        {
          id: '4',
          title: 'Creator sidebar update',
          category: 'UI Design',
          logTime: '20h',
          assignee: {
            name: 'Patricia Jones',
            initials: 'PJ'
          }
        },
        {
          id: '5',
          title: 'Update tertiary button color in DS',
          category: 'Design System',
          logTime: '-',
          assignee: {
            name: 'Michael Green',
            initials: 'MG'
          }
        }
      ]
    }
  ]

  return (
    <div className="flex h-full gap-6 px-6 overflow-x-auto">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex flex-col min-w-[360px] w-[360px] border-r border-dracula-surface/30"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold">
                {column.title}
              </h3>
              <span className="flex items-center justify-center min-w-6 h-6 px-2 text-xs font-medium bg-dracula-surface rounded-full">
                {column.tasks.length}
              </span>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                className="p-1.5 text-gray-500 hover:bg-dracula-surface/25 rounded transition-colors"
                aria-label={`Add item to ${column.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                className="p-1.5 text-gray-500 hover:bg-dracula-surface/25 rounded transition-colors"
                aria-label={`More options for ${column.title}`}
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column Content Area */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto">
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                category={task.category}
                logTime={task.logTime}
                commentsCount={task.commentsCount}
                assignee={task.assignee}
              />
            ))}
            
            {column.tasks.length === 0 && (
              <div className="flex items-center justify-center h-32 text-sm text-dracula-foreground/40">
                No tasks
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}