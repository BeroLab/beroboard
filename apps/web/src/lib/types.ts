export interface User {
	id: string;
	name: string;
	image: string | null;
}

export interface CreateOrganizationInput {
	name: string;
	description?: string;
}

export interface CreateLabelInput {
	text: string;
  color: string;
	organizationId: string
}

export interface UpdateLabelInput {
	text?: string;
  color?: string;
}

export interface TaskLabel {
	id: string;
	text: string;
	color: string;
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface Task {
	id: string;
	title: string;
	description: string | null;
	priority: "HIGH" | "MEDIUM" | "LOW" | "NONE";
	dueDate: Date | string | null;
	order: number;
	labels: TaskLabel[];
	columnId: string;
	organizationId: string;
	assigneeId: string | null;
	assignee: User | null;
	createdById: string;
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface TaskWithDetails extends Task {
	column: {
		id: string;
		name: string;
		color: string | null;
		isCompleted: boolean;
	};
	createdBy: User;
}

export interface Column {
	id: string;
	name: string;
	color: string | null;
	order: number;
	isCompleted: boolean;
	organizationId: string;
	tasks: Task[];
	createdAt: Date | string;
	updatedAt: Date | string;
}

export interface CreateTaskInput {
	title: string;
	description?: string;
	priority?: "HIGH" | "MEDIUM" | "LOW" | "NONE";
	dueDate?: string;
	labels?: TaskLabel[];
	columnId: string;
	organizationId: string;
	assigneeId?: string;
	createdById: string;
}

export interface UpdateTaskInput {
	title?: string;
	description?: string;
	priority?: "HIGH" | "MEDIUM" | "LOW" | "NONE";
	dueDate?: string;
	labels?: TaskLabel[];
	order?: number;
	columnId?: string;
	assigneeId?: string | null;
}

export interface MoveTaskInput {
	taskId: string;
	columnId: string;
	order: number;
}

export interface CreateColumnInput {
	name: string;
	color?: string;
	isCompleted?: boolean;
	organizationId: string;
}

export interface UpdateColumnInput {
	name?: string;
	color?: string;
	order?: number;
	isCompleted?: boolean;
}

export const DEFAULT_COLUMNS = [
	{ name: "Backlog", color: "#6B6B70", isCompleted: false },
	{ name: "In Progress", color: "#6366F1", isCompleted: false },
	{ name: "Review", color: "#FFB547", isCompleted: false },
	{ name: "Done", color: "#32D583", isCompleted: true },
] as const;

export type TaskCreatedMessage = {
	type: "task:created";
	data: {
		taskId: string;
		columnId: string;
		title: string;
	};
};

export type TaskUpdatedMessage = {
	type: "task:updated";
	data: {
		taskId: string;
	};
};

export type TaskDeletedMessage = {
	type: "task:deleted";
	data: {
		taskId: string;
	};
};

export type TaskMovedMessage = {
	type: "task:moved";
	data: {
		taskId: string;
		columnId: string;
		order: number;
	};
};

export type ColumnCreatedMessage = {
	type: "column:created";
	data: {
		columnId: string;
		name: string;
	};
};

export type ColumnUpdatedMessage = {
	type: "column:updated";
	data: {
		columnId: string;
	};
};

export type ColumnDeletedMessage = {
	type: "column:deleted";
	data: {
		columnId: string;
	};
};

export type ColumnsReorderedMessage = {
	type: "columns:reordered";
	data: {
		columns: Array<{
			id: string;
			order: number;
		}>;
	};
};

export type WebSocketMessage =
	| TaskCreatedMessage
	| TaskUpdatedMessage
	| TaskDeletedMessage
	| TaskMovedMessage
	| ColumnCreatedMessage
	| ColumnUpdatedMessage
	| ColumnDeletedMessage
	| ColumnsReorderedMessage
    | { type: "pong" };

export type WebSocketStatus = "connecting" | "connected" | "disconnected" | "error";

export interface UseWebSocketOptions {
	organizationId: string;
	enabled?: boolean;
	onError?: (error: unknown) => void;
}