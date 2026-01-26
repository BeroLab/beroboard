import { Elysia } from "elysia";

import { createTaskRouter } from "./create-task/router";
import { deleteTaskRouter } from "./delete-task/router";
import { getTaskRouter } from "./get-task/router";
import { moveTaskRouter } from "./move-task/router";
import { reorderTasksRouter } from "./reorder-tasks/router";
import { updateTaskRouter } from "./update-task/router";

export const tasksRouter = new Elysia({
	prefix: "/tasks",
	tags: ["tasks"],
})
	.use(getTaskRouter)
	.use(createTaskRouter)
	.use(updateTaskRouter)
	.use(deleteTaskRouter)
	.use(moveTaskRouter)
	.use(reorderTasksRouter);
