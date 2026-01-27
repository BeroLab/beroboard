export interface User {
	id: string;
	name: string;
	image: string | null;
}

export interface CreateOrganizationInput {
	name: string;
	description?: string;
}

export interface TaskLabel {
	text: string;
	color: string;
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
