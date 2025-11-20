import type { StagesApi } from "@/modules/stages/domain/stages.model";
import type { TaskApi } from "@/modules/task/domain/tasks.model";

export interface StageColumnViewProps {
   stage: StagesApi;
   renderTaskContent: (task: TaskApi) => React.ReactNode;
}
