export const boardKeys = {
	columns: (organizationId: string) => ["columns", organizationId] as const,
	task: (taskId: string) => ["task", taskId] as const,
};