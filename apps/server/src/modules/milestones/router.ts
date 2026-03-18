import { Elysia } from "elysia";
import { assignTasksMilestoneRouter } from "./assign-tasks-milestone/router";
import { createMilestoneRouter } from "./create-milestone/router";
import { deleteMilestonesRouter } from "./delete-milestone/router";
import { getMilestoneRouter } from "./get-milestone/router";
import { getMilestoneTasksRouter } from "./get-milestone-tasks/router";
import { getMilestonesRouter } from "./get-milestones/router";
import { updateMilestonesRouter } from "./update-milestone/router";

export const milestonesRouter = new Elysia({
	prefix: "/milestones",
	tags: ["milestones"],
}).use([
	getMilestoneRouter,
	getMilestonesRouter,
	createMilestoneRouter,
	updateMilestonesRouter,
	deleteMilestonesRouter,
	getMilestoneTasksRouter,
	assignTasksMilestoneRouter,
]);
