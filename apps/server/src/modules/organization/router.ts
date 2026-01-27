import { Elysia } from "elysia";
import { createOrganizationRouter } from "./create-organization/router";
import { deleteOrganizationRouter } from "./delete-organization/router";
import { getOrganizationsRouter } from "./get-organizations/router";
import { setActiveOrganizationRouter } from "./set-active-organization/router";

export const orgRouter = new Elysia({
	prefix: "/organizations",
	tags: ["organizations"],
})
	.use(createOrganizationRouter)
	.use(getOrganizationsRouter)
	.use(setActiveOrganizationRouter)
	.use(deleteOrganizationRouter);
